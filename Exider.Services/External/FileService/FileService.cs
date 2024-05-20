using CSharpFunctionalExtensions;
using Spire.Doc;
using System.Drawing.Imaging;
using Spire.Doc.Documents;
using System.Drawing;
using System.Xml.Linq;
using DocumentFormat.OpenXml.Packaging;
using OpenXmlPowerTools;
using Exider.Core;
using Exider.Core.Models.Storage;
using iTextSharp.text.pdf.parser;
using iTextSharp.text.pdf;
using System.Text;
using Exider.Repositories.Storage;
using System.IO.Compression;
using Exider.Core.Models.Formats;

namespace Exider.Services.External.FileService
{
    public class FileService : IFileService
    {
        private static SemaphoreSlim _semaphoreSlim = new SemaphoreSlim(1, 1);

        public async Task<Result<byte[]>> ReadFileAsync(string path)
        {
            await _semaphoreSlim.WaitAsync();

            try
            {
                if (string.IsNullOrEmpty(path) || string.IsNullOrWhiteSpace(path))
                {
                    return Result.Failure<byte[]>("Invalid path");
                }

                if (File.Exists(path) == false)
                {
                    return Result.Failure<byte[]>("File not found");
                }

                return await File.ReadAllBytesAsync(path);
            }
            catch (Exception)
            {
                return Result.Failure<byte[]>("Cannot read fileToWrite");
            }
            finally
            {
                _semaphoreSlim.Release();
            }
        }

        public byte[] GetWordDocumentPreviewImage(string path)
        {
            try
            {
                Document document = new Document();

                document.LoadFromFile(path);

                Image image = document.SaveToImages(0, ImageType.Bitmap);

                byte[] byteArray;
                using (MemoryStream stream = new MemoryStream())
                {
                    image.Save(stream, ImageFormat.Png);
                    byteArray = stream.ToArray();
                }

                return byteArray;
            }
            catch
            {
                return new byte[0];
            }
        }

        public byte[] GetPdfPreviewImage(string path)
        {
            try
            {
                Spire.Pdf.PdfDocument pdfDocument = new Spire.Pdf.PdfDocument();

                pdfDocument.LoadFromFile(path);

                Image image = pdfDocument.SaveAsImage(0);

                byte[] byteArray;

                using (MemoryStream stream = new MemoryStream())
                {
                    image.Save(stream, ImageFormat.Png);
                    byteArray = stream.ToArray();
                }

                return byteArray;
            }
            catch
            {
                return new byte[0];
            }
        }

        public Result<string> GetFileAsHTMLBase64String(FileModel fileModel)
        {
            if (fileModel.Type == null)
            {
                return Result.Failure<string>("Can't handle this file type");
            }

            Dictionary<string[], Configuration.ConvertToHtml> actions = new Dictionary<string[], Configuration.ConvertToHtml>
            {
                { Configuration.documentTypes, WordToHTML },
                { Configuration.imageTypes, ImageToHtml },
                { new string[] {"pdf"}, PdfToHtml },
            };

            KeyValuePair<string[], Configuration.ConvertToHtml> handler = 
                actions.FirstOrDefault(pair => pair.Key.Contains(fileModel.Type.ToLower()));

            if (handler.Value == null)
            {
                return Result.Failure<string>("Can't handle this file type");
            }

            return Result.Success(handler.Value(fileModel.Path));
        }

        public string WordToHTML(string path)
        {
            byte[] byteArray = File.ReadAllBytes(path);

            using (MemoryStream memoryStream = new MemoryStream())
            {
                memoryStream.Write(byteArray, 0, byteArray.Length);

                using (WordprocessingDocument doc = WordprocessingDocument.Open(memoryStream, true))
                {
                    HtmlConverterSettings settings = new HtmlConverterSettings()
                    {
                        PageTitle = "None"
                    };
                    XElement html = OpenXmlPowerTools.HtmlConverter.ConvertToHtml(doc, settings);

                    return html.ToStringNewLineOnAttributes();
                }
            }
        }

        private string ImageToHtml(string path)
            => $"<img src=\"data:image/png;base64,{Convert.ToBase64String(File.ReadAllBytes(path))}\">";

        private string PdfToHtml(string path)
        {
            PdfReader reader = new PdfReader(path);
            StringWriter output = new StringWriter();

            for (int i = 1; i <= reader.NumberOfPages; i++)
            {
                iTextSharp.text.pdf.parser.LocationTextExtractionStrategy strategy = new LocationTextExtractionStrategy();
                string currentText = PdfTextExtractor.GetTextFromPage(reader, i, strategy);

                currentText = Encoding.UTF8.GetString(Encoding.Convert(Encoding.Default, Encoding.UTF8, Encoding.Default.GetBytes(currentText)));
                output.WriteLine(currentText);
            }

            reader.Close();
            return output.ToString();
        }

        private async Task DeleteFolderContent
        (
            IFolderRepository folderRepository,
            IFileRespository fileRespository,
            Guid id
        )
        {
            FileModel[] files = await fileRespository
                .GetByFolderId(Guid.Empty, id);

            foreach (FileModel file in files)
            {
                await fileRespository.Delete(file.Id);
            }

            await folderRepository.Delete(id);
        }

        public async Task DeleteFolderById
        (
            IFileRespository fileRespository,
            IFolderRepository folderRepository,
            Guid id
        )
        {
            await DeleteFolderContent(folderRepository, fileRespository, id);

            FolderModel[] folders = await folderRepository
                .GetFoldersByFolderId(this, Guid.Empty, id);

            foreach (FolderModel folder in folders)
            {
                await DeleteFolderById(fileRespository, folderRepository, folder.Id);
            }
        }

        public byte[] CreateZipFromFiles(FileModel[] files)
        {
            using (var memoryStream = new MemoryStream())
            {
                using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
                {
                    foreach (var file in files)
                    {
                        ZipArchiveEntry fileToWrite = archive.CreateEntry($"{file.Name}.{file.Type}");

                        try
                        {
                            using (var entryStream = fileToWrite.Open())
                            {
                                byte[] fileBytes = File.ReadAllBytes(file.Path);
                                entryStream.Write(fileBytes, 0, fileBytes.Length);
                            }

                        } catch { }
                    }
                }

                return memoryStream.ToArray();
            }
        }

        public string ConvertSystemTypeToContentType(string systemType)
        {
            if (Configuration.imageTypes.Contains(systemType.ToLower()))
            {
                return "image/" + systemType;
            }

            return "application/" + systemType;
        }

        public async Task WriteFileAsync(string path, byte[] file)
        {
            await File.WriteAllBytesAsync(path, file);
        }

        public byte[] GetSongPreviewImage(string type, string path)
        {
            try
            {
                string? mimeType;

                if (!SongFormat.mimeTypes.ContainsKey(type.ToLower()))
                {
                    return new byte[0];
                }

                mimeType = SongFormat.mimeTypes[type.ToLower()];

                var file = TagLib.File.Create(path, mimeType, TagLib.ReadStyle.None);
                var id3TagData = file.Tag;

                if (id3TagData.Pictures.Length > 0)
                {
                    var firstPicture = id3TagData.Pictures[0];
                    var pictureData = firstPicture.Data.Data;

                    return pictureData;
                }
            } 
            catch { }

            return new byte[0];
        }
    }
}