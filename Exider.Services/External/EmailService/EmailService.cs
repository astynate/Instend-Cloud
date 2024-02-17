using System.Net.Mail;
using System.Net;
using Exider.Dependencies.Services;
using Exider.Core;
using Exider.Core.Models.Account;

namespace Exider_Version_2._0._0.ServerApp.Services
{

    public class EmailService : IEmailService
    {

        private static readonly string _emailConfirmationHtml = "<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <meta name=\"google\" content=\"notranslate\">\r\n    <style>\r\n        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');\r\n        * {\r\n            margin: 0;\r\n            padding: 0;\r\n            box-sizing: border-box;\r\n        }\r\n        body {\r\n            font-family: 'Open Sans', sans-serif;\r\n            color: black;\r\n        }\r\n        .m-b {\r\n            margin-bottom: 20px;\r\n        }\r\n        .m-b-10 {\r\n            margin-bottom: 10px;\r\n        }\r\n        h1 {\r\n            font-size: 26px;\r\n            color: black;\r\n        }\r\n        h2 {\r\n            color: black;\r\n        }\r\n        h3 {\r\n            font-size: 16px;\r\n            color: black;\r\n        }\r\n        .wrapper {\r\n            height: auto;\r\n            width: 425px;\r\n            margin-top: 20px;\r\n            margin-left: auto;\r\n            margin-right: auto;\r\n            text-align: center;\r\n        }\r\n        .content-wrapper {\r\n            padding-left: 10px;\r\n            padding-right: 10px;\r\n        }\r\n        .content-divide {\r\n            margin-top: 30px;\r\n            margin-bottom: 30px;\r\n            border: 1px solid #eaeaea;\r\n        }\r\n        .logo {\r\n            height: 70px;\r\n            width: 70px;\r\n            margin-bottom: 10px;\r\n            object-fit: contain;\r\n            user-select: none;\r\n        }\r\n        .logo-wrapper {\r\n            height: auto;\r\n            width: 100%;\r\n        }\r\n        .logo-link {\r\n            height: auto;\r\n            width: auto;\r\n        }\r\n        p {\r\n            align-self: center;\r\n            font-weight: 500;\r\n            font-size: 14px;\r\n            text-align: center;\r\n            color: #515151;\r\n        }\r\n        span {\r\n            color: #2f8fff;\r\n            cursor: pointer;\r\n            user-select: none;\r\n        }\r\n        a {\r\n            text-decoration: none;\r\n        }\r\n        .button {\r\n            background: #2b80ff;\r\n            border-radius: 30px;\r\n            text-align: center;\r\n            margin-top: 20px;\r\n            width: fit-content;\r\n            user-select: none;\r\n            font-weight: 600;\r\n            display: flex;\r\n            text-transform: uppercase;\r\n            text-decoration: none;\r\n            margin-left: auto;\r\n            margin-right: auto;\r\n            color: white;\r\n            outline: none;\r\n            border: none;\r\n            outline: none;\r\n            font-size: 14px;\r\n            transition: 0.1s ease;\r\n        }\r\n        .code {\r\n            height: auto;\r\n            width: fit-content;\r\n            text-align: center;\r\n            padding: 10px 25px;\r\n            background: #f3f3f3;\r\n            margin-left: auto;\r\n            margin-right: auto;\r\n            margin-bottom: 20px;\r\n            border-radius: 12px;\r\n            font-size: 12px;\r\n        }\r\n        footer {\r\n            height: auto;\r\n            width: 100%;\r\n            padding: 10px 10px;\r\n            background: #f9f9f9;\r\n            text-align: left;\r\n            border-radius: 6px;\r\n            color: #bdbdbd;\r\n        }\r\n        footer p {\r\n            text-align: left;\r\n            margin-bottom: 5px;\r\n        }\r\n        .exider-security {\r\n            display: grid;\r\n            width: fit-content;\r\n        }\r\n        .footer-logo {\r\n            height: 26px;\r\n            width: 26px;\r\n            object-fit: contain;\r\n            padding: 5px;\r\n            background: white;\r\n            border: 1px solid #e3e3e3;\r\n            border-radius: 6px;\r\n        }\r\n        .footer-link {\r\n            color: #ababab;\r\n            font-size: 12px;\r\n            text-align: right;\r\n            text-decoration: underline;\r\n        }\r\n        .social-network {\r\n            height: 20px;\r\n            width: 20px;\r\n            margin-top: 5px;\r\n            object-fit: contain;\r\n        }\r\n        .footer-first-line {\r\n            margin-top: 3px;\r\n        }\r\n        @media (max-width: 470px) {\r\n            .content-wrapper {\r\n                padding-left: 20px;\r\n                padding-right: 20px;\r\n            }\r\n            .wrapper {\r\n                width: 100vw;\r\n            }\r\n            .footer-first-line {\r\n                margin-top: 10px;\r\n            }\r\n            footer {\r\n                padding: 0;\r\n                font-size: 11px;\r\n                padding: 20px;\r\n            }\r\n        }\r\n    </style>\r\n\r\n</head>\r\n<body>\r\n\r\n    <div class=\"wrapper\">\r\n        <div class=\"content-wrapper\">\r\n            <div class=\"logo-wrapper\">\r\n                <a href=\"https://exider.com\" class=\"logo-link\">\r\n                    <img src=\"https://lh3.googleusercontent.com/u/0/drive-viewer/AEYmBYS-b_pMLiSYlDXWgyda29nFKjnMYUtiWpiwYhqwvDkihZBzsq1RAQGsR9cCBgmo8NOBuyg03EXGrxatGF8bD1mbNB0E0w=w1960-h2358\" class=\"logo\" draggable=\"false\" />\r\n                </a>\r\n            </div>\r\n            <h1 class=\"m-b-10\">Successfully registered</h1>\r\n            <p class=\"m-b\">Thank you for choosing to register an account with us. To complete your registration, please <span>follow the link</span> below and enter the <span>confirmation code.</span></p>\r\n            <div class=\"button m-b\"><a href=\"LINK\" style=\"color: white; height: 100%; width: 100%; cursor: pointer; padding: 15px 45px;\">Confirm email</a></div>\r\n            <hr class=\"content-divide\">\r\n            <p class=\"m-b\">You will be asked to enter <span>this code</span>,<br>\r\n            Pease <span>do not show</span> it to anyone</p>\r\n            <div class=\"code\">\r\n                <h2>CODE</h2>\r\n            </div>\r\n        </div>\r\n        <footer>\r\n            <div class=\"header\">\r\n                <div style=\"width: 100%; display: flex;\">\r\n                    <div style=\"width: 35px;\">\r\n                        <img src=\"https://lh3.googleusercontent.com/u/0/drive-viewer/AEYmBYS-b_pMLiSYlDXWgyda29nFKjnMYUtiWpiwYhqwvDkihZBzsq1RAQGsR9cCBgmo8NOBuyg03EXGrxatGF8bD1mbNB0E0w=w1960-h2358\" class=\"footer-logo\" draggable=\"false\">\r\n                    </div>\r\n                    <div style=\"margin-right: auto;\">\r\n                        <div style=\"margin-bottom: 5px; font-size: 12px; color: #333; margin-top: 5px; font-weight: 600; display: flex; grid-gap: 3px;\"><div style=\"font-weight: 700;\">Exider</div> Security</div>\r\n                    </div>\r\n                    <div style=\"display: flex; margin-left: auto; margin-top: 5px;\">\r\n                        <a href=\"#\" class=\"footer-link\" style=\"margin-right: 15px; color :#ababab;\">Terms of use</a>\r\n                        <a href=\"#\" class=\"footer-link\" style=\"color :#ababab;\">Privacy policy</a>\r\n                    </div>\r\n                </div>\r\n                <div style=\"height: 1px; width: 100%; background: #ddd;\" class=\"footer-first-line\"></div>\r\n                <h3 style=\"margin-top: 10px; font-size: 12px; color: #999;\">Why did you receive this letter?</h3>\r\n                <p style=\"margin-top: 5px; font-size: 12px; color: #ccc;\">An attempt was made to register an account using your email. If this is not you, then simply ignore this message and without email confirmation, the account will be automatically deleted after 7 days</p>\r\n                <h3 style=\"margin-top: 10px; font-size: 12px; color: #999;\">About Us</h3>\r\n                <p style=\"margin-top: 5px; font-size: 12px; color: #ccc;\">Exider helps you automatically sync files across your devices, share them with friends, and edit them using neural networks</p>\r\n                <div style=\"margin-top: 10px; height: 1px; width: 100%; background: #ddd;\"></div>\r\n                <div style=\"width: 100%; margin-top: 5px; display: flex;\">\r\n                    <div style=\"font-size: 12px; margin-top: 7px; color: #999; font-weight: 500;\">Copyright © Andreev S, 2024</div>\r\n                    <div style=\"margin-left: auto;\">\r\n                        <a href=\"https://www.facebook.com/profile.php/?id=61553222136930&paipv=0&eav=AfYg6dkHp8U4FG3lqDfucLJeTJhV-2BSs3BHd1zuu6Jv5qQShEmPZRbBFigDzrt5DA4&_rdr\">\r\n                            <img src=\"https://lh3.googleusercontent.com/u/0/drive-viewer/AEYmBYTfQNqazCHHCbxZmCr0kOxYtWdbh2VnjuwqQxzmZ2HP4w8Y_65PS9sESnI9umZ68bEovOtxf5QaYx5wnQo0HtxQUDdzbw=w2202-h1806\" class=\"social-network\" draggable=\"false\">\r\n                        </a>\r\n                        <a href=\"https://instagram.com/exider_company\" style=\"margin-left: 10px;\">\r\n                            <img src=\"https://lh3.googleusercontent.com/u/0/drive-viewer/AEYmBYStK2z8yF3WeYCtuAiKYId1eD3bMF6WCXtkwH9_EQXc9FYBbQn1secyYHosdLvh22DhcmTF8w-Mgcyzv9gOOnxxEOndwQ=w2202-h1806\" class=\"social-network\" draggable=\"false\">\r\n                        </a>\r\n                        <a href=\"https://twitter.com/exider_company\" style=\"margin-left: 10px;\">\r\n                            <img src=\"https://lh3.googleusercontent.com/u/0/drive-viewer/AEYmBYRgJfk4dawv4Q1U2enhjupDnfVDC1BuxLiqmbVpfxASMUQCCRU-6tOpXp1Vp61MDzhPl2FKHts7Pk0LujRUoPcVTOfNVQ=w1920-h945\" class=\"social-network\" draggable=\"false\">\r\n                        </a>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </footer>\r\n    </div>\r\n</body>\r\n</html>";

        private readonly IValidationService _validationService;

        public EmailService(IValidationService validationService)
        {
            _validationService = validationService;
        }

        private async Task SendEmailAsync(string email, string template)
        {

            if (_validationService.ValidateEmail(email) == false)
            {
                throw new ArgumentNullException(nameof(email));
            }

            if (string.IsNullOrEmpty(template))
            {
                throw new ArgumentException(nameof(template));
            }

            MailAddress sender = new MailAddress(Configuration.corporateEmail, "Exider Security");
            MailAddress recipient = new MailAddress(email);
            MailMessage mail = new MailMessage(sender, recipient);

            mail.Subject = "Email confirmation";
            mail.Body = template;
            mail.IsBodyHtml = true;

            SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587);

            smtp.Credentials = new NetworkCredential(Configuration.corporateEmail, Configuration.corporatePassword);
            smtp.EnableSsl = true;

            await smtp.SendMailAsync(mail);

        }

        public async Task SendEmailConfirmation(string email, string code, string link)
        {

            string template = _emailConfirmationHtml;

            await SendEmailAsync(email, template
                .Replace("CODE", code).Replace("LINK", link));

        }

        public async Task SendPasswordResetEmail(string email, string link, SessionModel model)
        {
            throw new NotImplementedException();
        }

        public async Task SendLoginNotificationEmail(string email, string link, SessionModel model)
        {
            throw new NotImplementedException();
        }

    }

}
