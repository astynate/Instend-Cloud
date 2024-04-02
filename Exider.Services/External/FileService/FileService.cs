using CSharpFunctionalExtensions;
using Spire.Doc;
using System.Drawing.Imaging;
using Spire.Doc.Documents;
using System.Drawing;
using Spire.Pdf;

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
                return Result.Failure<byte[]>("Cannot read file");
            }
            finally
            {
                _semaphoreSlim.Release();
            }
        }

        public async Task<byte[]> GetWordDocumentPreviewImage(string path)
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

        public async Task<byte[]> GetPdfPreviewImage(string path)
        {
            try
            {
                PdfDocument pdfDocument = new PdfDocument();

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
    }
}
