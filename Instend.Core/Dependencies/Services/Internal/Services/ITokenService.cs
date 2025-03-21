﻿namespace Instend.Core.Dependencies.Services.Internal.Services
{
    public interface ITokenService
    {
        string GenerateAccessToken(string id, int time, string key);
        string GenerateRefreshToken(string id);
        string? GetUserIdFromToken(string? token);
        bool IsTokenValid(string token);
        bool IsTokenAlive(string token);
    }
}