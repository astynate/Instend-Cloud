using System.Text;
using System.Text.RegularExpressions;

namespace Exider.Services.External.EmailService
{

    public static class HtmlEncoder
    {

        private static readonly string _imagePattern = "<img.*?src=[\"']?(.*?)[\"']?\\s.*?>";

        private static readonly Mutex _mutex = new Mutex();

        public static string EncodeHtml(string html)
        {

            string result = Regex.Replace(html, _imagePattern, match =>
            {
                string imagePath = match.Groups[1].Value;
                string base64String = GetImageBase64String(imagePath);
                return $"<img src=\"data:image;base64,{base64String}\" />";
            });

            return result.Replace("\n", "");

        }

        public static void EncodeHtmlFromFile(string path, string outputPath)
        {

            if (path != null)
            {

                File.WriteAllLines(outputPath, new string[] {

                    EncodeHtml(string.Join("", File.ReadAllLines(path)))

                });

            }

        }

        private static string GetImageBase64String(string imagePath)
        {

            if (string.IsNullOrEmpty(imagePath))
            {
                throw new ArgumentException(imagePath, nameof(imagePath));
            }

            _mutex.WaitOne();

            try
            {
                return Convert.ToBase64String(File.ReadAllBytes(imagePath));
            }

            finally
            {
                _mutex.ReleaseMutex();
            }

        }

    }

}
