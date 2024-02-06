using System.Text;
using System.Text.RegularExpressions;

namespace Exider.Services.External.EmailService
{

    public static class HtmlEncoder
    {

        private static readonly string _imagePattern = "<img.*?src=[\"']?(.*?)[\"'].*/>";

        private static readonly Mutex _mutex = new Mutex();

        public static string EncodeHtml(string html)
        {

            Console.WriteLine(html);

            string result = Regex.Replace(html, _imagePattern, match =>
            {

                string imagePath = match.Groups[1].Value;
                string base64Image = GetImageBase64String(imagePath);

                return match.Value.Replace(match.Groups[1].Value, $"data:image/png;base64,{base64Image}");

            });

            return result.Replace("\n", "");

        }

        public static void EncodeHtmlFromFile(string path, string outputPath)
        {

            if (path != null)
            {

                File.WriteAllText(outputPath, 
                    EncodeHtml(string.Join("", File.ReadAllLines(path))));

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
