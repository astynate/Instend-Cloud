using Instend.Core.Models.Abstraction;
using NAudio.Wave;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Formats
{
    [Table("songs_meta")]
    public class SongFormat : FormatBase
    {
        [Column("title")] public string? Title { get; private set; } = string.Empty;
        [Column("artist")] public string? Artist { get; private set; } = string.Empty;
        [Column("album")] public string? Album { get; private set; } = string.Empty;
        [Column("plays")] public uint Plays { get; private set; } = 0;
        [Column("release_date")] public DateTime RealeseDate { get; private set; } = DateTime.Now;
        [Column("genre")] public string? Genre { get; private set; } = string.Empty;
        [Column("duration-ticks")]  public long DurationTicks { get; set; }

        [NotMapped] public static string[] SongTypes = { "mp3", "mp4", "m4a", "aiff", "wav" };

        [NotMapped] public byte[] CoverAsBytes = new byte[0];

        [NotMapped] static public Dictionary<string, string> mimeTypes = new Dictionary<string, string>()
        {
            {"mp3", "audio/mpeg"},
            {"m4a", "audio/mp4"}
        };

        [NotMapped]
        public TimeSpan Duration
        {
            get { return TimeSpan.FromTicks(DurationTicks); }
            set { DurationTicks = value.Ticks; }
        }

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

            Duration = file.Properties != null ? file.Properties.Duration : TimeSpan.Zero;

            if (file.Properties != null)
            {
                Duration = file.Properties.Duration;
            }
            else 
            {
                using (var m4aReader = new MediaFoundationReader(path))
                {
                    Duration = m4aReader.TotalTime;
                }
            }

            Title = id3TagData.Title;
            Artist = string.Join("|||", id3TagData.Performers);
            Album = id3TagData.Album;
            Plays = 0;
            RealeseDate = DateTime.Now;
            Genre = string.Join("|||", id3TagData.Genres);   
        }

        public void UpdateData(byte[] bytes, string? title, string? artist, string? album, string type, string path)
        {
            string? mimeType;

            if (!mimeTypes.ContainsKey(type.ToLower()))
            {
                return;
            }

            mimeType = mimeTypes[type.ToLower()];

            var file = TagLib.File.Create(path, mimeType, TagLib.ReadStyle.None);
            var id3TagData = file.Tag;

            if (bytes.Length > 0)
            {
                TagLib.Picture[] pictures = {new TagLib.Picture()};
                
                pictures[0].Data = bytes;
                id3TagData.Pictures = pictures;
            }

            id3TagData.Title = title;
            id3TagData.Performers = new[] { artist };
            id3TagData.Album = album;

            Title = id3TagData.Title;
            Artist = string.Join("|||", id3TagData.Performers);
            Album = id3TagData.Album;
            Plays = 0;
            RealeseDate = DateTime.Now;
            Genre = string.Join("|||", id3TagData.Genres);

            file.Save();
        }
    }
}