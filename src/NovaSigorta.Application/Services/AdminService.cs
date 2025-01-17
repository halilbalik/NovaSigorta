using BCrypt.Net;
using NovaSigorta.Application.DTOs;
using NovaSigorta.Application.Helpers;
using NovaSigorta.Application.Interfaces;

namespace NovaSigorta.Application.Services;

public class AdminService : IAdminService
{
    private readonly IAdminRepository _adminRepository;

    public AdminService(IAdminRepository adminRepository)
    {
        _adminRepository = adminRepository;
    }

    public async Task<AdminLoginResponseDto> LoginAsync(AdminLoginDto dto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return new AdminLoginResponseDto
                {
                    Success = false,
                    Message = "Kullanıcı adı ve şifre boş olamaz"
                };
            }

            var admin = await _adminRepository.GetByUsernameAsync(dto.Username);
            if (admin == null)
            {
                return new AdminLoginResponseDto
                {
                    Success = false,
                    Message = "Kullanıcı adı veya şifre hatalı"
                };
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, admin.PasswordHash);
            if (!isPasswordValid)
            {
                return new AdminLoginResponseDto
                {
                    Success = false,
                    Message = "Kullanıcı adı veya şifre hatalı"
                };
            }

            admin.LastLoginAt = DateTime.UtcNow;
            await _adminRepository.UpdateAsync(admin);

            var token = JwtHelper.GenerateToken(admin.Username, admin.Id);

            return new AdminLoginResponseDto
            {
                Success = true,
                Token = token,
                Message = "Giriş başarılı"
            };
        }
        catch (Exception ex)
        {
            return new AdminLoginResponseDto
            {
                Success = false,
                Message = $"Hata oluştu: {ex.Message}"
            };
        }
    }

    public async Task<bool> ValidateTokenAsync(string token)
    {
        try
        {
            var principal = JwtHelper.ValidateToken(token);
            if (principal == null)
            {
                return false;
            }

            var username = principal.Identity?.Name;
            if (string.IsNullOrEmpty(username))
            {
                return false;
            }

            var admin = await _adminRepository.GetByUsernameAsync(username);
            return admin != null;
        }
        catch
        {
            return false;
        }
    }

    public async Task<ResponseDto<AdminDto>> GetAdminProfileAsync(string username)
    {
        try
        {
            var admin = await _adminRepository.GetByUsernameAsync(username);
            if (admin == null)
            {
                return ResponseDto<AdminDto>.ErrorResult("Admin bulunamadı");
            }

            var dto = new AdminDto
            {
                Id = admin.Id,
                Username = admin.Username,
                CreatedAt = admin.CreatedAt,
                LastLoginAt = admin.LastLoginAt
            };

            return ResponseDto<AdminDto>.SuccessResult(dto);
        }
        catch (Exception ex)
        {
            return ResponseDto<AdminDto>.ErrorResult($"Hata oluştu: {ex.Message}");
        }
    }
}
