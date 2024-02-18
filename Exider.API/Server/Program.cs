using Exider.Core;
using Exider.Core.Dependencies.Repositories.Account;
using Exider.Dependencies.Services;
using Exider.Repositories.Account;
using Exider.Repositories.Email;
using Exider.Repositories.Repositories;
using Exider.Services.Internal.Handlers;
using Exider.Services.Middleware;
using Exider_Version_2._0._0.ServerApp.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddTransient<LoggingMiddleware>();
builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<DatabaseContext>();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<IEmailRepository, EmailRepository>();
builder.Services.AddScoped<ISessionsRepository, SessionsRepository>();
builder.Services.AddScoped<IConfirmationRespository, ConfirmationRespository>();

builder.Services.AddSingleton<IValidationService, ValidationService>();
builder.Services.AddSingleton<ITokenService, JwtService>();
builder.Services.AddSingleton<IEncryptionService, EncryptionService>();
builder.Services.AddSingleton<IEmailService, EmailService>();
builder.Services.AddSingleton<IUserAgentHandler, UserAgentHandler>();

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

app.Run();
