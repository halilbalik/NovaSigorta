using NovaSigorta.Application.DTOs;
using NovaSigorta.Application.Interfaces;
using NovaSigorta.Domain.Entities;

namespace NovaSigorta.Application.Services;

public class InsuranceService : IInsuranceService
{
    private readonly IInsuranceRepository _insuranceRepository;

    public InsuranceService(IInsuranceRepository insuranceRepository)
    {
        _insuranceRepository = insuranceRepository;
    }

    public async Task<ResponseDto<List<InsuranceDto>>> GetAllInsurancesAsync()
    {
        try
        {
            var insurances = await _insuranceRepository.GetAllAsync();
            var dto = insurances.Select(MapToDto).OrderBy(x => x.Name).ToList();
            return ResponseDto<List<InsuranceDto>>.SuccessResult(dto);
        }
        catch (Exception ex)
        {
            return ResponseDto<List<InsuranceDto>>.ErrorResult($"Hata oluştu: {ex.Message}");
        }
    }

    public async Task<ResponseDto<List<InsuranceDto>>> GetActiveInsurancesAsync()
    {
        try
        {
            var insurances = await _insuranceRepository.GetActiveInsurancesAsync();
            var dto = insurances.Select(MapToDto).ToList();
            return ResponseDto<List<InsuranceDto>>.SuccessResult(dto);
        }
        catch (Exception ex)
        {
            return ResponseDto<List<InsuranceDto>>.ErrorResult($"Hata oluştu: {ex.Message}");
        }
    }

    public async Task<ResponseDto<InsuranceDto>> GetInsuranceByIdAsync(int id)
    {
        try
        {
            var insurance = await _insuranceRepository.GetByIdAsync(id);
            if (insurance == null)
            {
                return ResponseDto<InsuranceDto>.ErrorResult("Sigorta bulunamadı");
            }

            var dto = MapToDto(insurance);
            return ResponseDto<InsuranceDto>.SuccessResult(dto);
        }
        catch (Exception ex)
        {
            return ResponseDto<InsuranceDto>.ErrorResult($"Hata oluştu: {ex.Message}");
        }
    }

    public async Task<ResponseDto<InsuranceDto>> CreateInsuranceAsync(CreateInsuranceDto dto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return ResponseDto<InsuranceDto>.ErrorResult("Sigorta adı boş olamaz");
            }

            var existingInsurance = await _insuranceRepository.FirstOrDefaultAsync(x => x.Name == dto.Name);
            if (existingInsurance != null)
            {
                return ResponseDto<InsuranceDto>.ErrorResult("Bu isimde bir sigorta zaten mevcut");
            }

            var insurance = new Insurance
            {
                Name = dto.Name,
                Description = dto.Description,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            var createdInsurance = await _insuranceRepository.AddAsync(insurance);
            var resultDto = MapToDto(createdInsurance);

            return ResponseDto<InsuranceDto>.SuccessResult(resultDto, "Sigorta başarıyla oluşturuldu");
        }
        catch (Exception ex)
        {
            return ResponseDto<InsuranceDto>.ErrorResult($"Hata oluştu: {ex.Message}");
        }
    }

    public async Task<ResponseDto<InsuranceDto>> UpdateInsuranceAsync(int id, UpdateInsuranceDto dto)
    {
        try
        {
            var insurance = await _insuranceRepository.GetByIdAsync(id);
            if (insurance == null)
            {
                return ResponseDto<InsuranceDto>.ErrorResult("Sigorta bulunamadı");
            }

            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return ResponseDto<InsuranceDto>.ErrorResult("Sigorta adı boş olamaz");
            }

            var existingInsurance = await _insuranceRepository.FirstOrDefaultAsync(x => x.Name == dto.Name && x.Id != id);
            if (existingInsurance != null)
            {
                return ResponseDto<InsuranceDto>.ErrorResult("Bu isimde bir sigorta zaten mevcut");
            }

            insurance.Name = dto.Name;
            insurance.Description = dto.Description;
            insurance.UpdatedAt = DateTime.UtcNow;

            await _insuranceRepository.UpdateAsync(insurance);
            var resultDto = MapToDto(insurance);

            return ResponseDto<InsuranceDto>.SuccessResult(resultDto, "Sigorta başarıyla güncellendi");
        }
        catch (Exception ex)
        {
            return ResponseDto<InsuranceDto>.ErrorResult($"Hata oluştu: {ex.Message}");
        }
    }

    public async Task<ResponseDto> DeleteInsuranceAsync(int id)
    {
        try
        {
            var insurance = await _insuranceRepository.GetInsuranceWithApplicationsAsync(id);
            if (insurance == null)
            {
                return ResponseDto.ErrorResult("Sigorta bulunamadı");
            }

            if (insurance.Applications.Any())
            {
                return ResponseDto.ErrorResult("Bu sigortaya ait başvurular bulunduğu için silinemez");
            }

            await _insuranceRepository.DeleteAsync(insurance);
            return ResponseDto.SuccessResult("Sigorta başarıyla silindi");
        }
        catch (Exception ex)
        {
            return ResponseDto.ErrorResult($"Hata oluştu: {ex.Message}");
        }
    }

    public async Task<ResponseDto> ToggleInsuranceStatusAsync(int id)
    {
        try
        {
            var insurance = await _insuranceRepository.GetByIdAsync(id);
            if (insurance == null)
            {
                return ResponseDto.ErrorResult("Sigorta bulunamadı");
            }

            insurance.IsActive = !insurance.IsActive;
            insurance.UpdatedAt = DateTime.UtcNow;

            await _insuranceRepository.UpdateAsync(insurance);

            var status = insurance.IsActive ? "aktif" : "pasif";
            return ResponseDto.SuccessResult($"Sigorta durumu {status} olarak güncellendi");
        }
        catch (Exception ex)
        {
            return ResponseDto.ErrorResult($"Hata oluştu: {ex.Message}");
        }
    }

    private static InsuranceDto MapToDto(Insurance insurance)
    {
        return new InsuranceDto
        {
            Id = insurance.Id,
            Name = insurance.Name,
            Description = insurance.Description,
            IsActive = insurance.IsActive,
            CreatedAt = insurance.CreatedAt,
            UpdatedAt = insurance.UpdatedAt
        };
    }
}
