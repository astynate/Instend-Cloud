using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Models.Formats;
using System.Drawing;
using System.Drawing.Imaging;
using Spire.Doc.Documents;
using NReco.VideoConverter;
using Document = Spire.Doc.Document;
using Instend.Core.Models.Abstraction;

namespace Instend.Services.External.FileService
{
    public class PreviewService : IPreviewService
    {
        private readonly IImageService _imageService;

        public PreviewService(IImageService imageService)
        {
            _imageService = imageService;
        }

        public async Task<Result<byte[]>> GetPreview(string? type, string path)
        {
            if (File.Exists(path) == false)
                return Result.Success(new byte[0]);

            if (string.IsNullOrEmpty(type) || string.IsNullOrWhiteSpace(type))
                return Result.Success(new byte[0]);

            var actions = new Dictionary<string[], Configuration.HandleFileCover>
            {
                { Configuration.imageTypes, GetImagePereview },
                { Configuration.documentTypes, GetDocumentPreview },
                { Configuration.videoTypes, VideoHandler },
                { new string[] { "pdf" }, GetPdfPreview },
                { new string[] { "mp3" }, GetSongPreview },
            };

            KeyValuePair<string[], Configuration.HandleFileCover> handler = actions
                .FirstOrDefault(pair => pair.Key.Contains(type.ToLower()));

            if (handler.Value != null)
            {
                try
                {
                    byte[] file = await handler.Value((type, path));
                    return Result.Success(_imageService.CompressImage(file, 10, type ?? ""));
                }
                catch
                {
                    return Result.Success(new byte[0]);
                }
            }

            return Result.Success(new byte[0]);
        }

        private async Task<byte[]> GetSongPreview((string type, string path) parameters)
        {
            string? mimeType;

            if (!SongFormat.mimeTypes.ContainsKey(parameters.type.ToLower()))
                return Array.Empty<byte>();

            mimeType = SongFormat.mimeTypes[parameters.type.ToLower()];

            var file = TagLib.File.Create(parameters.path, mimeType, TagLib.ReadStyle.None);
            var id3TagData = file.Tag;

            if (id3TagData.Pictures.Length > 0)
            {
                var firstPicture = id3TagData.Pictures[0];
                var pictureData = firstPicture.Data.Data;

                return pictureData;
            }

            return Array.Empty<byte>();
        }

        private async Task<byte[]> GetPdfPreview((string type, string path) parameters)
        {
            Spire.Pdf.PdfDocument pdfDocument = new Spire.Pdf.PdfDocument(); pdfDocument.LoadFromFile(parameters.path);
            Image image = pdfDocument.SaveAsImage(0);

            byte[] byteArray = Array.Empty<byte>();

            using (MemoryStream stream = new MemoryStream())
            {
                image.Save(stream, ImageFormat.Png);
                byteArray = stream.ToArray();
            }

            return byteArray;
        }

        private async Task<byte[]> GetDocumentPreview((string type, string path) parameters)
        {
            Document document = new Document(); document.LoadFromFile(parameters.path);
            Image image = document.SaveToImages(0, ImageType.Bitmap);

            byte[] byteArray;

            using (MemoryStream stream = new MemoryStream())
            {
                image.Save(stream, ImageFormat.Png);
                byteArray = stream.ToArray();
            }

            return byteArray;
        }

        private async Task<byte[]> GetImagePereview((string type, string path) parameters)
        {
            return await File.ReadAllBytesAsync(parameters.path);
        }

        private async Task<byte[]> VideoHandler((string type, string path) parameters)
        {
            FFMpegConverter ffMpeg = new FFMpegConverter();

            using (MemoryStream ms = new MemoryStream())
            {
                ffMpeg.GetVideoThumbnail(parameters.path, ms, 1);
                return ms.ToArray();
            }
        }
    }
}