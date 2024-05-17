using CSharpFunctionalExtensions;
using static TagLib.File;

namespace Exider.Services.External.FileService
{
    public class MusicService
    {
        public async Task<Result> AddSong(byte[] file)
        {
            using (var stream = new MemoryStream(file))
            {
                var tagLibFile = TagLib.File.Create(new Fi);

                string title = file.Tag.Title;
                string[] artists = file.Tag.Performers;
                string album = file.Tag.Album;
                uint year = file.Tag.Year;
                string[] genres = file.Tag.Genres;

                // Выводим метаданные
                Console.WriteLine("Title: " + title);
                Console.WriteLine("Artists: " + string.Join(", ", artists));
                Console.WriteLine("Album: " + album);
                Console.WriteLine("Year: " + year);
                Console.WriteLine("Genres: " + string.Join(", ", genres));
            }

            return Result.Success();
        }
    }
}
