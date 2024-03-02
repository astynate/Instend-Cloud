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
        };

        public async Task<Result> UpdateAvatar(string path, byte[] avatar)
        {
            if (avatar == null)
            {
                return Result.Failure("Invalid avatar");
            }

            if (ValidateImage(avatar) == false)
            {
                return Result.Failure("Invalid avatar size");
            }

            await File.WriteAllBytesAsync(path, avatar);
            return Result.Success();
        }

        private bool ValidateImage(byte[] inputImage)
        {
            try
            {
                using (MemoryStream ms = new MemoryStream(inputImage))
                {
                    Image image = Image.FromStream(ms);

                    //if (image.Width <= 32 || image.Height <= 32 || image.Width >= 4000 || image.Height >= 4000)
                    //{
                    //    return false;
                    //}
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
