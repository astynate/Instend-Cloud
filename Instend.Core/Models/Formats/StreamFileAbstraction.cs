namespace Instend.Core.Models.Formats
{
    internal class StreamFileAbstraction : TagLib.File.IFileAbstraction
    {
        public StreamFileAbstraction(string name, Stream readStream, Stream writeStream)
        {
            Name = name;
            ReadStream = readStream;
            WriteStream = writeStream;
        }

        public void CloseStream(Stream stream)
        {
            stream.Close();
        }

        public string Name { get; private set; }
        public Stream ReadStream { get; private set; }
        public Stream WriteStream { get; private set; }
    }
}