using NovaSigorta.Application.DTOs;

namespace NovaSigorta.Application.Interfaces;

public interface IAdminService
{
    Task<AdminLoginResponseDto> LoginAsync(AdminLoginDto dto);
    Task<bool> ValidateTokenAsync(string token);
    Task<ResponseDto<AdminDto>> GetAdminProfileAsync(string username);
}
