using Exider.Services.External.FileService;
using NAudio.Wave;
using System.ComponentModel.DataAnnotations.Schema;
using System.IO;

namespace Exider.Core.Models.Formats
{
    [Table("songs_meta")]
    public class SongFormat : FormatBase
    {
        [Column("name")] public string Name { get; private set; } = string.Empty;
        [Column("cover")] public string? Cover { get; private set; } = string.Empty;
        [Column("artist")] public string? Artist { get; private set; } = string.Empty;
        [Column("album")] public string? Album { get; private set; } = string.Empty;
        [Column("plays")] public uint Plays { get; private set; } = 0;
        [Column("release_date")] public DateTime RealeseDate { get; private set; } = DateTime.Now;
        [Column("genre")] public string? Genre { get; private set; } = string.Empty;

        [NotMapped] public static string[] SongTypes = { "mp3", "mp4", "aiff", "wav" };

        [NotMapped] public static byte[] CoverAsBytes = new byte[0];

        public SongFormat() { }

        public override bool DoesFormatBelongs(string format)
        {
            return SongTypes.Contains(format);
        }


        public async override Task SetMetaDataFromFile(IFileService fileService, byte[] file)
        {
            using (var stream = new MemoryStream(file))
            {
                var mp3FileReader = new Mp3FileReader(stream);
                var id3TagData = mp3FileReader.Id3v2Tag;

                if (id3TagData.Pictures.Length > 0)
                {
                    var firstPicture = id3TagData.Pictures[0];
                    var pictureData = firstPicture.Data;

                    CoverAsBytes = pictureData;
                }

                Name = id3TagData.Title;
                Artist = string.Join("|||", id3TagData.Performers);
                Album = id3TagData.Album;
                Cover = CoverAsBytes != null ? Configuration.SystemDrive + "__songs__/" + FileId.ToString() : null;
                Plays = 0;
                RealeseDate = new DateTime((int)id3TagData.Year, 1, 1);
                Genre = string.Join("|||", id3TagData.Genres);

                if (CoverAsBytes != null && Cover != null)
                {
                    await fileService.WriteFileAsync(Cover, CoverAsBytes);
                }
            }
        }
    }
}