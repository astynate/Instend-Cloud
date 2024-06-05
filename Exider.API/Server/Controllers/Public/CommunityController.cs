using Exider.Repositories.Public;
using Exider.Services.Internal.Handlers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace Exider_Version_2._0._0.Server.Controllers.Public
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommunityController : ControllerBase
    {
        private readonly ICommunityRepository _communityRepository;

        private readonly IRequestHandler _requestHandler;

        public CommunityController(ICommunityRepository communityRepository, IRequestHandler requestHandler)
        {
            _communityRepository = communityRepository;
            _requestHandler = requestHandler;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetPopularCommunities(int from, int count)
        {
            if (from >= count)
            {
                return BadRequest("Invalid range");
            }

            return Ok(await _communityRepository.GetPopularCommunitiesAsync(from, count));
        }

        [HttpGet]
        [Authorize]
        [Route("/api/[controller]/single")]
        public async Task<IActionResult> GetCommunity(string id)
        {
            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id)) 
            {
                BadRequest("Community not found");
            }
            
            return Ok(await _communityRepository.GetCommunityById(Guid.Parse(id)));
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCommunity
        (
            [FromForm] string? name,
            [FromForm] string? description,
            [FromForm] IFormFile? avatar,
            [FromForm] IFormFile? header
        )
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest("Invalid user id");

            byte[] avatarBytes = Array.Empty<byte>();
            byte[] headerBytes = Array.Empty<byte>();

            if (avatar != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await avatar.CopyToAsync(memoryStream);
                    avatarBytes = memoryStream.ToArray();
                }
            }

            if (header != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await header.CopyToAsync(memoryStream);
                    headerBytes = memoryStream.ToArray();
                }
            }

            if (avatarBytes == Array.Empty<byte>())
                return Conflict("Invalid avatar");

            if (headerBytes == Array.Empty<byte>())
                return Conflict("Invalid header");

            var result = await _communityRepository.AddAsync(Guid.Parse(userId.Value), name, description, avatarBytes, headerBytes);

            if (result.IsFailure)
                return Conflict(result.Error);

            return Ok(result.Value);
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateCommunity
        (
            [FromForm] Guid id,
            [FromForm] string? name,
            [FromForm] string? description,
            [FromForm] IFormFile? avatar,
            [FromForm] IFormFile? header
        )
        {
            var userId = _requestHandler.GetUserId(Request.Headers["Authorization"]);

            if (userId.IsFailure)
                return BadRequest("Invalid user id");

            byte[] avatarBytes = Array.Empty<byte>();
            byte[] headerBytes = Array.Empty<byte>();

            if (avatar != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await avatar.CopyToAsync(memoryStream);
                    avatarBytes = memoryStream.ToArray();
                }
            }

            if (header != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await header.CopyToAsync(memoryStream);
                    headerBytes = memoryStream.ToArray();
                }
            }

            var result = await _communityRepository.UpdateAsync(id, Guid.Parse(userId.Value), name, description, avatarBytes, headerBytes);

            if (result.IsFailure)
                return Conflict(result.Error);

            return Ok(result.Value);
        }
    }
}
