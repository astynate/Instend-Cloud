using CSharpFunctionalExtensions;
using System.Drawing;
using System.Drawing.Imaging;

namespace Instend.Services.External.FileService
{
    public class ImageService : IImageService
    {
        private bool ValidateImage(byte[] inputImage)
        {
            using (MemoryStream ms = new MemoryStream(inputImage))
            {
                using (Image image = Image.FromStream(ms))
                {
                    if (ImageFormat.Png.Equals(image.RawFormat))
                    {
                        return image.Width >= 64 && image.Height >= 64 &&
                               image.Width <= 5000 && image.Height <= 5000;
                    }
                }
            }

            return false;
        }

        public byte[] ResizeImageToBase64(byte[] inputImage, int maxSize)
        {
            try
            {
                using (MemoryStream originalStream = new MemoryStream(inputImage))
                {
                    using (Image originalImage = Image.FromStream(originalStream))
                    {
                        int newWidth;
                        int newHeight;

                        if (originalImage.Width > originalImage.Height)
                        {
                            newWidth = maxSize;
                            newHeight = (int)(originalImage.Height * maxSize / (double)originalImage.Width);
                        }
                        else
                        {
                            newHeight = maxSize;
                            newWidth = (int)(originalImage.Width * maxSize / (double)originalImage.Height);
                        }

                        using (Bitmap newImage = new Bitmap(originalImage, new Size(newWidth, newHeight)))
                        {
                            using (MemoryStream newStream = new MemoryStream())
                            {
                                newImage.Save(newStream, ImageFormat.Png);
                                byte[] compressedImageBytes = newStream.ToArray();

                                return compressedImageBytes;
                            }
                        }
                    }
                }
            }
            catch
            {
                return [];
            }
        }

        public byte[] CompressImage(byte[] inputImage, int quality, string type)
        {
            if (inputImage == null || inputImage.Length == 0)
            {
                return inputImage ?? [];
            }

            Dictionary<string, ImageFormat> keyValuePairs = new()
            {
                { "png", ImageFormat.Png },
                { "jpg", ImageFormat.Jpeg },
            };

            ImageFormat format = ImageFormat.Png;

            if (keyValuePairs.ContainsKey(type.ToLower()) == false)
                return inputImage;

            using (var inputStream = new MemoryStream(inputImage))
            {
                using (var outputStream = new MemoryStream())
                {
                    using (var bitmap = new Bitmap(inputStream))
                    {
                        EncoderParameters encoderParameters = new EncoderParameters(1);
                        encoderParameters.Param[0] = new EncoderParameter(Encoder.Quality, quality);

                        ImageCodecInfo codecInfo = GetEncoderInfo(format);
                        bitmap.Save(outputStream, codecInfo, encoderParameters);
                    }

                    return outputStream.ToArray();
                }
            }
        }

        private ImageCodecInfo? GetEncoderInfo(ImageFormat format)
        {
            ImageCodecInfo[] codecs = ImageCodecInfo.GetImageEncoders();
            
            foreach (ImageCodecInfo codec in codecs)
            {
                if (codec.FormatID == format.Guid)
                {
                    return codec;
                }
            }

            return null;
        }

        public async Task<Result<string>> ReadImageAsBase64(string path)
        {
            if (File.Exists(path))
            {
                byte[] result = await File.ReadAllBytesAsync(path);
                return Result.Success(Convert.ToBase64String(result));
            }

            return string.Empty;
        }
    }
}