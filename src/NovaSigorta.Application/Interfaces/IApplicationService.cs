using NovaSigorta.Application.DTOs;

namespace NovaSigorta.Application.Interfaces;

public interface IApplicationService
{
    Task<ResponseDto<List<ApplicationDto>>> GetAllApplicationsAsync();
    Task<ResponseDto<ApplicationDto>> GetApplicationByIdAsync(int id);
    Task<ResponseDto<ApplicationDto>> CreateApplicationAsync(CreateApplicationDto dto);
    Task<ResponseDto<List<ApplicationDto>>> GetApplicationsByInsuranceIdAsync(int insuranceId);
}
