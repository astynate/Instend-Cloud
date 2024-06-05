using Exider.Repositories.Public;
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

        public CommunityController(ICommunityRepository communityRepository)
        {
            _communityRepository = communityRepository;
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
            {
                return Conflict("Invalid avatar");
            }

            if (headerBytes == Array.Empty<byte>())
            {
                return Conflict("Invalid header");
            }

            var result = await _communityRepository.AddAsync(name, description, avatarBytes, headerBytes);

            if (result.IsFailure)
            {
                return Conflict(result.Error);
            }

            return Ok(result.Value);
        }
    }
}
