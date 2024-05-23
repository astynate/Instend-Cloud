using Exider.Core;
using Exider.Core.Dependencies.Repositories.Account;
using Exider.Core.Models.Access;
using Exider.Core.Models.Account;
using Exider.Core.Models.Storage;
using Exider.Dependencies.Services;
using Exider.Repositories.Account;
using Exider.Repositories.Comments;
using Exider.Repositories.Email;
using Exider.Repositories.Gallery;
using Exider.Repositories.Links;
using Exider.Repositories.Repositories;
using Exider.Repositories.Storage;
using Exider.Services.External.FileService;
using Exider.Services.Internal.Handlers;
using Exider.Services.Middleware;
using Exider_Version_2._0._0.Server.Hubs;
using Exider_Version_2._0._0.ServerApp.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder.WithOrigins("http://localhost:44441")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});

builder.Services.AddTransient<LoggingMiddleware>();
builder.Services.AddControllersWithViews();
builder.Services.AddSignalR();

builder.Services.AddDbContext<DatabaseContext>();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<IEmailRepository, EmailRepository>();
builder.Services.AddScoped<ISessionsRepository, SessionsRepository>();
builder.Services.AddScoped<IConfirmationRespository, ConfirmationRespository>();
builder.Services.AddScoped<IUserDataRepository, UserDataRepository>();
builder.Services.AddScoped<IFolderRepository, FolderRepository>();
builder.Services.AddScoped<IFileRespository, FileRespository>();
builder.Services.AddScoped<IAlbumRepository, AlbumRepository>();
builder.Services.AddScoped<ICommentBaseRepository, CommentBaseRepository>();
builder.Services.AddScoped(typeof(ICommentsRepository<>), typeof(CommentsRepository<>));
builder.Services.AddScoped(typeof(IAccessRepository<,>), typeof(AccessRepository<,>));
builder.Services.AddScoped(typeof(IFormatRepository<>), typeof(FormatRepository<>));
builder.Services.AddScoped(typeof(ILinkBaseRepository<>), typeof(LinkBaseRepository<>));

builder.Services.AddSingleton<IValidationService, ValidationService>();
builder.Services.AddSingleton<ITokenService, JwtService>();
builder.Services.AddSingleton<IEncryptionService, EncryptionService>();
builder.Services.AddSingleton<IEmailService, EmailService>();
builder.Services.AddSingleton<IUserAgentHandler, UserAgentHandler>();
builder.Services.AddSingleton<IRequestHandler, RequestHandler>();
builder.Services.AddSingleton<IFileService, FileService>();
builder.Services.AddSingleton<IImageService, ImageService>();

builder.Services.AddScoped<IAccessHandler, AccessHandler>();

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
            LifetimeValidator = (before, expires, token, param) => expires > DateTime.UtcNow,
            IssuerSigningKey = Configuration.GetSecurityKey(),
        };
    });


var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseCors("CorsPolicy");
app.UseMiddleware<LoggingMiddleware>();

app.Use(async (context, next) =>
{
    string? accessToken = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
    string? refreshToken = context.Request.Cookies["system_refresh_token"];

    ITokenService tokenService = context.RequestServices.GetRequiredService<ITokenService>();

    if (!string.IsNullOrEmpty(accessToken) && !string.IsNullOrEmpty(refreshToken) && tokenService.IsTokenAlive(accessToken) == false)
    {
        ISessionsRepository sessionsRepository = context.RequestServices.GetRequiredService<ISessionsRepository>();

        string userId = tokenService.GetUserIdFromToken(accessToken);

        if (tokenService.IsTokenValid(accessToken))
        {
            SessionModel? sessionModel = await sessionsRepository
                .GetSessionByTokenAndUserId(Guid.Parse(userId), refreshToken);

            if (sessionModel != null && sessionModel.EndTime >= DateTime.Now)
            {
                accessToken = tokenService.GenerateAccessToken(userId, Configuration.accsessTokenLifeTimeInMinutes,
                    Configuration.TestEncryptionKey);

                context.Request.Headers["Authorization"] = "Bearer " + accessToken;
                context.Response.Headers["Refresh"] = accessToken;
            }
        }
    }

    await next(context);
});

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.UseAuthentication();
app.UseAuthorization();

app.MapHub<MessageHub>("/message-hub");
app.MapHub<StorageHub>("/storage-hub");
app.MapHub<GalleryHub>("/gallery-hub");
app.Run();
