using CSharpFunctionalExtensions;
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

        private byte[] ResizeImageToBase64(byte[] inputImage, int width)
        {
            try
            {
                using (MemoryStream originalStream = new MemoryStream(inputImage))
                {
                    using (Image originalImage = Image.FromStream(originalStream))
                    {
                        int maxWidth = 256;
                        int maxHeight = 256;
                        int newWidth;
                        int newHeight;

                        if (originalImage.Width > originalImage.Height)
                        {
                            newWidth = maxWidth;
                            newHeight = (int)(originalImage.Height * maxWidth / (double)originalImage.Width);
                        }
                        else
                        {
                            newHeight = maxHeight;
                            newWidth = (int)(originalImage.Width * maxHeight / (double)originalImage.Height);
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

        public async Task<Result> UpdateAvatar(IUserDataRepository repository, Guid userId, string path, string avatar)
        {
            if (avatar == null)
            {
                return Result.Failure("Invalid avatar");
            }

            byte[] avatarAsByteArray = Convert.FromBase64String(avatar);

            //if (ValidateImage(avatarAsByteArray) == false)
            //{
            //    return Result.Failure("Invalid avatar size");
            //}

            await repository.UpdateAvatarAsync(userId, path);
            await File.WriteAllBytesAsync(path, avatarAsByteArray);

            return Result.Success();
        }

        public async Task<Result> DeleteAvatar(IUserDataRepository repository, Guid userId, string path)
        {
            await repository.UpdateAvatarAsync(userId, path);
            await Task.Run(() => File.Delete(path));

            return Result.Success();
        }

        public async Task<Result> UpdateHeader(IUserDataRepository repository, Guid userId, string path, string header)
        {
            if (header == null)
            {
                return Result.Failure("Invalid avatar");
            }

            byte[] headerAsByteArray = Convert.FromBase64String(header);

            //if (ValidateImage(headerAsByteArray) == false)
            //{
            //    return Result.Failure("Invalid avatar size");
            //}

            await repository.UpdateHeaderAsync(userId, path);
            await File.WriteAllBytesAsync(path, headerAsByteArray);

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