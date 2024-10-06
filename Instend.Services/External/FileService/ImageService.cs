using CSharpFunctionalExtensions;
using Exider.Core.Models.Account;
using Exider.Repositories.Account;
using System.Drawing;
using System.Drawing.Imaging;

namespace Exider.Services.External.FileService
{
    public class ImageService : IImageService
    {
        private bool ValidateImage(byte[] inputImage)
        {
            try
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
            }
            catch { }

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
                return new byte[0];
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

            if (keyValuePairs.ContainsKey(type.ToLower()))
            {
                format = keyValuePairs[type];
            }
            else
            {
                return inputImage;
            }

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

        public async Task<Result> UpdateAvatar(IUserDataRepository repository, Guid userId, string path, string image)
        {
            var user = await repository.GetUserAsync(userId);

            if (user.IsFailure == true)
                return Result.Failure("User not found");

            var imageAsByteArray = Convert.FromBase64String(image);

            await repository.UpdateAvatarAsync(userId, path);

            if (user.Value.Avatar != null && File.Exists(user.Value.Avatar) == true)
                File.Delete(user.Value.Avatar);

            await File.WriteAllBytesAsync(path, imageAsByteArray);

            return Result.Success();
        }

        public async Task<Result> DeleteAvatar(IUserDataRepository repository, Guid userId, string path)
        {
            await repository.UpdateAvatarAsync(userId, path);
            await Task.Run(() => File.Delete(path));

            return Result.Success();
        }

        public async Task<Result> UpdateHeader(IUserDataRepository repository, Guid userId, string path, string image)
        {
            var user = await repository.GetUserAsync(userId);

            if (user.IsFailure == true)
                return Result.Failure("User not found");

            var imageAsByteArray = Convert.FromBase64String(image);

            await repository.UpdateHeaderAsync(userId, path);

            if (user.Value.Header != null && File.Exists(user.Value.Header) == true)
                File.Delete(user.Value.Header);

            await File.WriteAllBytesAsync(path, imageAsByteArray);

            return Result.Success();
        }

        public async Task<Result> DeleteHeader(IUserDataRepository repository, Guid userId, string path)
        {
            await repository.UpdateHeaderAsync(userId, "");
            await Task.Run(() => File.Delete(path));

            return Result.Success();
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