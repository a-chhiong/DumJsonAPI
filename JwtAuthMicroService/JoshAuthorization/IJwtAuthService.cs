using JoshAuthorization.Models;
using JoshAuthorization.Objects;
using Microsoft.AspNetCore.Http;

namespace JoshAuthorization;

public interface IJwtAuthService
{
    /// <summary>
    /// Generates a pair of Access and Refresh tokens. 
    /// If clientJwk is provided, the Access Token will be DPoP-bound (Sender Constrained).
    /// </summary>
    JwtWrapper Create(string? subject, object? custom, JwkObject? clientJwk = null);

    /// <summary>
    /// Validates a standard JWT (Access Token).
    /// </summary>
    /// <param name="token">The JWT string.</param>
    Task<JwtAuthResult<TokenData>> ValidateAccess(string? token);
    
    /// <summary>
    /// Validates a standard JWT (Refresh Token).
    /// </summary>
    /// <param name="token">The JWT string.</param>
    Task<JwtAuthResult<TokenData>> ValidateRefresh(string? token);
    
    /// <summary>
    /// Validates initial DPoP Proof
    /// </summary>
    /// <param name="token">The DPoP header value.</param>
    /// <param name="request">The HTTP Request</param>
    Task<JwtAuthResult<DPoPData>> ValidateDPoP(string? token, HttpRequest request);
    
    /// <summary>
    /// Validates both the Access Token and the DPoP Proof, ensuring they are bound together.
    /// </summary>
    /// <param name="token">The DPoP header value.</param>
    /// <param name="request">The HTTP Request</param>
    Task<JwtAuthResult<AccessData>> ValidateAccess(string? token, string? dpop, HttpRequest request);
}