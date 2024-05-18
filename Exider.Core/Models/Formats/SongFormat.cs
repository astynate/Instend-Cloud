using Exider.Services.External.FileService;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Formats
{
    [Table("songs_meta")]
    public class SongFormat : FormatBase
    {
        [Column("artist")] public string? Artist { get; private set; } = string.Empty;
        [Column("album")] public string? Album { get; private set; } = string.Empty;
        [Column("plays")] public uint Plays { get; private set; } = 0;
        [Column("release_date")] public DateTime RealeseDate { get; private set; } = DateTime.Now;
        [Column("genre")] public string? Genre { get; private set; } = string.Empty;

        [NotMapped] public static string[] SongTypes = { "mp3", "mp4", "aiff", "wav" };

        [NotMapped] public byte[] CoverAsBytes = new byte[0];

        [NotMapped] static public Dictionary<string, string> mimeTypes = new Dictionary<string, string>()
        {
            {"mp3", "audio/mpeg"}
        };

        public SongFormat() { }

        public override bool DoesFormatBelongs(string format)
        {
            return SongTypes.Contains(format);
        }

        public override void SetMetaDataFromFile(string type, string path)
        {
            string? mimeType;

            if (!mimeTypes.ContainsKey(type.ToLower()))
            {
                return;
            }

            mimeType = mimeTypes[type.ToLower()];

            var file = TagLib.File.Create(path, mimeType, TagLib.ReadStyle.None);
            var id3TagData = file.Tag;

            if (id3TagData.Pictures.Length > 0)
            {
                var firstPicture = id3TagData.Pictures[0];
                var pictureData = firstPicture.Data.Data;

                CoverAsBytes = pictureData;
            }

            Artist = string.Join("|||", id3TagData.Performers);
            Album = id3TagData.Album;
            Plays = 0;
            RealeseDate = DateTime.Now;
            Genre = string.Join("|||", id3TagData.Genres);
        }
    }
}