using Instend.Core;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Core.Models.Account;
using Instend.Dependencies.Services;
using Instend.Repositories.Account;
using Instend.Repositories.Comments;
using Instend.Repositories.Gallery;
using Instend.Repositories.Messenger;
using Instend.Repositories.Repositories;
using Instend.Repositories.Storage;
using Instend.Services.External.FileService;
using Instend.Services.Internal.Handlers;
using Instend.Services.Middleware;
using Instend_Version_2._0._0.Server.Hubs;
using Instend_Version_2._0._0.ServerApp.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Instend.Core.Dependencies.Services.Internal.Services;
using Instend.Core.Dependencies.Services.Internal.Helpers;
using Instend.Repositories.Contexts;
using Instend.Services.Internal.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder
        .SetIsOriginAllowed(origin => true)
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});

builder.Services.AddTransient<LoggingMiddleware>();
builder.Services.AddControllersWithViews();
builder.Services.AddSignalR();

builder.Services.AddDbContext<AccountsContext>();
builder.Services.AddDbContext<AccessContext>();
builder.Services.AddDbContext<MessagesContext>();
builder.Services.AddDbContext<PublicationsContext>();
builder.Services.AddDbContext<StorageContext>();

builder.Services.AddScoped<IAccountsRepository, AccountsRepository>();
builder.Services.AddScoped<ISessionsRepository, SessionsRepository>();
builder.Services.AddScoped<IConfirmationsRepository, ConfirmationsRespository>();
builder.Services.AddScoped<ICollectionsRepository, CollectionsRepository>();
builder.Services.AddScoped<IFileRespository, FilesRespository>();
builder.Services.AddScoped<IAlbumsRepository, AlbumsRepository>();
builder.Services.AddScoped<IDirectRepository, DirectRepository>();
builder.Services.AddScoped<IMessengerRepository, MessengerRepository>();
builder.Services.AddScoped<IFriendsRepository, FriendsRepository>();
builder.Services.AddScoped<IGroupsRepository, GroupsRepository>();
builder.Services.AddScoped<IAccessHandler, AccessHandler>();
builder.Services.AddScoped<IPublicationsRepository, PublicationsRepository>();

builder.Services.AddSingleton<IValidationService, ValidationService>();
builder.Services.AddSingleton<IPreviewService, PreviewService>();
builder.Services.AddSingleton<ITokenService, JwtService>();
builder.Services.AddSingleton<IEncryptionService, EncryptionService>();
builder.Services.AddSingleton<IEmailService, EmailService>();
builder.Services.AddSingleton<ISerializationHelper, SerializationHelper>();
builder.Services.AddSingleton<IUserAgentHandler, UserAgentHandler>();
builder.Services.AddSingleton<IRequestHandler, RequestHandler>();
builder.Services.AddSingleton<IFileService, FileService>();
builder.Services.AddSingleton<IImageService, ImageService>();

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

app.UseMiddleware<LoggingMiddleware>();

app.Use(async (context, next) =>
{
    var accessToken = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
    var refreshToken = context.Request.Cookies["system_refresh_token"];

    ITokenService tokenService = context.RequestServices.GetRequiredService<ITokenService>();

    var isTokensEmpthy = string.IsNullOrEmpty(accessToken) == false && string.IsNullOrEmpty(refreshToken) == false;
    var isTokensValid = tokenService.IsTokenValid(accessToken) == true && tokenService.IsTokenAlive(accessToken) == false;

    if (isTokensEmpthy && isTokensValid)
    {
        var sessionsRepository = context.RequestServices.GetRequiredService<ISessionsRepository>();
        var userId = tokenService.GetUserIdFromToken(accessToken);

        if (tokenService.IsTokenValid(accessToken) && string.IsNullOrEmpty(userId) == false)
        {
            AccountSession? sessionModel = await sessionsRepository
                .GetSessionByTokenAndUserId(Guid.Parse(userId), refreshToken ?? "");

            if (sessionModel != null && sessionModel.EndTime >= DateTime.Now)
            {
                accessToken = tokenService.GenerateAccessToken(userId, Configuration.accessTokenLifeTimeInMinutes,
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
app.UseCors("CorsPolicy");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.UseAuthentication();
app.UseAuthorization();

app.MapHub<GlobalHub>("/global-hub").RequireCors("CorsPolicy");

app.Run();