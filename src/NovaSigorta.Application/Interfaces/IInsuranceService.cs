using NovaSigorta.Application.DTOs;

namespace NovaSigorta.Application.Interfaces;

public interface IInsuranceService
{
    Task<ResponseDto<List<InsuranceDto>>> GetAllInsurancesAsync();
    Task<ResponseDto<List<InsuranceDto>>> GetActiveInsurancesAsync();
    Task<ResponseDto<InsuranceDto>> GetInsuranceByIdAsync(int id);
    Task<ResponseDto<InsuranceDto>> CreateInsuranceAsync(CreateInsuranceDto dto);
    Task<ResponseDto<InsuranceDto>> UpdateInsuranceAsync(int id, UpdateInsuranceDto dto);
    Task<ResponseDto> DeleteInsuranceAsync(int id);
    Task<ResponseDto> ToggleInsuranceStatusAsync(int id);
}
