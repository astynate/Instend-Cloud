using CSharpFunctionalExtensions;

namespace Exider.Services.External.FileService
{
    public class FileService
    {

        private static SemaphoreSlim _semaphoreSlim = new SemaphoreSlim(1, 1);

        public async Task<Result<byte[]>> ReadFileAsync(string path)
        {

            await _semaphoreSlim.WaitAsync();

            try
            {
                if (string.IsNullOrEmpty(path) || string.IsNullOrWhiteSpace(path))
                {
                    return Result.Failure<byte[]>("Invalid path");
                }

                if (File.Exists(path) == false)
                {
                    return Result.Failure<byte[]>("File not found");
                }

                return await File.ReadAllBytesAsync(path);
            }
            catch (Exception)
            {
                return Result.Failure<byte[]>("Cannot read file");
            }
            finally
            {
                _semaphoreSlim.Release();
            }

        }
    }
}
