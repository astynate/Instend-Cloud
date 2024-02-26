using Exider.Core;
using Exider.Core.Dependencies.Repositories.Account;
using Exider.Core.Models.Account;
using Exider.Dependencies.Services;
using Exider.Repositories.Account;
using Exider.Repositories.Email;
using Exider.Repositories.Repositories;
using Exider.Services.External.FileService;
using Exider.Services.Internal.Handlers;
using Exider.Services.Middleware;
using Exider_Version_2._0._0.ServerApp.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.IdentityModel.Tokens;
using System.Net;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddTransient<LoggingMiddleware>();
builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<DatabaseContext>();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<IEmailRepository, EmailRepository>();
builder.Services.AddScoped<ISessionsRepository, SessionsRepository>();
builder.Services.AddScoped<IConfirmationRespository, ConfirmationRespository>();
builder.Services.AddScoped<IUserDataRepository, UserDataRepository>();

builder.Services.AddSingleton<IValidationService, ValidationService>();
builder.Services.AddSingleton<ITokenService, JwtService>();
builder.Services.AddSingleton<IEncryptionService, EncryptionService>();
builder.Services.AddSingleton<IEmailService, EmailService>();
builder.Services.AddSingleton<IUserAgentHandler, UserAgentHandler>();
builder.Services.AddSingleton<IRequestHandler, RequestHandler>();
builder.Services.AddSingleton<IFileService, FileService>();

builder.Services.AddAuthorization();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)

    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = Configuration.Issuer,
            ValidAudience = Configuration.Audience,
            LifetimeValidator = (before, expires, token, param) =>
            {
                return expires > DateTime.Now;
            },
            IssuerSigningKey = Configuration.GetSecurityKey(),
        };
    });


var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseMiddleware<LoggingMiddleware>();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.UseStatusCodePages(async (context) =>
{
    string? accessToken = context.HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
    string? refreshToken = context.HttpContext.Request.Cookies["system_refresh_token"];

    if (!string.IsNullOrEmpty(accessToken) && !string.IsNullOrEmpty(refreshToken) && context.HttpContext.Response.StatusCode == 401)
    {
        ITokenService tokenService = context.HttpContext.RequestServices.GetRequiredService<ITokenService>();
        ISessionsRepository sessionsRepository = context.HttpContext.RequestServices.GetRequiredService<ISessionsRepository>();

        string userId = tokenService.GetUserIdFromToken(accessToken);

        if (tokenService.IsTokenValid(accessToken))
        {
            SessionModel? sessionModel = await sessionsRepository
                .GetSessionByTokenAndUserId(Guid.Parse(userId), refreshToken);

            if (sessionModel != null && sessionModel.EndTime >= DateTime.Now)
            {
                accessToken = tokenService.GenerateAccessToken(userId, Configuration.accsessTokenLifeTimeInMinutes,
                    Configuration.TestEncryptionKey);

                await Console.Out.WriteLineAsync(context.HttpContext.Request.PathBase);
                await Console.Out.WriteLineAsync(context.HttpContext.Request.Path);

                var client = new HttpClient();
                var request = new HttpRequestMessage(new HttpMethod(context.HttpContext.Request.Method), context.HttpContext.Request.PathBase);

                request.Headers.Add("Authorization", "Bearer " + accessToken);

                using (var stream = new MemoryStream())
                {
                    await context.HttpContext.Request.Body.CopyToAsync(stream);

                    stream.Seek(0, SeekOrigin.Begin);
                    request.Content = new StreamContent(stream);
                }

                var response = await client.SendAsync(request);
                response.Headers.Add("Refresh", "Bearer " + accessToken);

            }
        }
    }
});

app.UseAuthentication();
app.UseAuthorization();

app.Run();
