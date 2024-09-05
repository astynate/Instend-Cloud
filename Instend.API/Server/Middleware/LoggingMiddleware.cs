
namespace Exider.Services.Middleware
{
    public class LoggingMiddleware : IMiddleware
    {
        private readonly ILogger<LoggingMiddleware> _logger;

        public LoggingMiddleware(ILogger<LoggingMiddleware> logger)
        {
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            }

            catch (Exception exception)
            {
                _logger.LogError(exception, "Something went wrong");

                context.Response.Clear();
                context.Response.Headers.Append("Error", "Something went wrong");
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            }
        }
    }
}
