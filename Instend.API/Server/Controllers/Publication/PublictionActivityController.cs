using Instend.Core.Models.Publication;
using Instend.Repositories.Comments;
using Instend.Services.Internal.Handlers;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNetCore.Mvc;

namespace Instend_Version_2._0._0.Server.Controllers.Comments
{
    [ApiController]
    [Route("[controller]")]
    public class PublictionActivityController : ControllerBase
    {
        private readonly IPublicationBaseRepository<PublicationAttachment> _commentsRepository;

        private readonly IRequestHandler _requestHandler;

        public PublictionActivityController(IPublicationBaseRepository<PublicationAttachment> commentsRepository, IRequestHandler requestHandler)
        {
            _commentsRepository = commentsRepository;
            _requestHandler = requestHandler;
        }
    }
}