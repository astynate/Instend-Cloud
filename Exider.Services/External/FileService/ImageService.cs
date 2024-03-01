using CSharpFunctionalExtensions;
using System.Drawing;
using System.Drawing.Imaging;

namespace Exider.Services.External.FileService
{
    public class ImageService : IImageService
    {

        public static readonly List<Guid> supportedTypes = new List<Guid>
        {
            ImageFormat.Png.Guid,
            ImageFormat.Jpeg.Guid,
            ImageFormat.Jpeg.Guid,
        };

        public async Task<Result> UpdateAvatar(string path, string avatar)
        {
            if (avatar == null || avatar == "Default")
            {
                return Result.Failure("Invalid avatar");
            }

            if (ValidateImage(avatar) == false)
            {
                return Result.Failure("Invalid avatar size");
            }

            await File.WriteAllTextAsync(path, ResizeImageToBase64(avatar, 128));
            return Result.Success();
        }

        private bool ValidateImage(string base64String)
        {
            try
            {
                byte[] bytes = Convert.FromBase64String(base64String);

                using (MemoryStream ms = new MemoryStream(bytes))
                {
                    Image image = Image.FromStream(ms);

                    if (!supportedTypes.Contains(image.RawFormat.Guid) == false)
                    {
                        return false;
                    }

                    if (image.Width <= 64 || image.Height <= 64 || image.Width >= 4000 || image.Height >= 4000)
                    {
                        return false;
                    }
                }
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        private string ResizeImageToBase64(string base64String, int width)
        {
            byte[] bytes = Convert.FromBase64String(base64String);

            using (MemoryStream ms = new MemoryStream(bytes))
            {
                using (Image image = Image.FromStream(ms))
                {
                    int newHeight = (int)(((double)width / image.Width) * image.Height);

                    using (Image newImage = new Bitmap(image, width, newHeight))
                    {
                        using (MemoryStream newMs = new MemoryStream())
                        {
                            newImage.Save(newMs, image.RawFormat);
                            return Convert.ToBase64String(newMs.ToArray());
                        }
                    }
                }
            }
        }
    }
}
