using NovaSigorta.Application.DTOs;
using NovaSigorta.Application.Interfaces;
using NovaSigorta.Domain.Entities;
using ApplicationEntity = NovaSigorta.Domain.Entities.Application;

namespace NovaSigorta.Application.Services;

public class ApplicationService : IApplicationService
{
    private readonly IApplicationRepository _applicationRepository;
    private readonly IInsuranceRepository _insuranceRepository;

    public ApplicationService(IApplicationRepository applicationRepository, IInsuranceRepository insuranceRepository)
    {
        _applicationRepository = applicationRepository;
        _insuranceRepository = insuranceRepository;
    }

    public async Task<ResponseDto<List<ApplicationDto>>> GetAllApplicationsAsync()
    {
        try
        {
            var applications = await _applicationRepository.GetApplicationsWithInsuranceAsync();
            var dto = applications.Select(app => MapToDto(app)).ToList();
            return ResponseDto<List<ApplicationDto>>.SuccessResult(dto);
        }
        catch (Exception ex)
        {
            return ResponseDto<List<ApplicationDto>>.ErrorResult($"Hata oluştu: {ex.Message}");
        }
    }

    public async Task<ResponseDto<ApplicationDto>> GetApplicationByIdAsync(int id)
    {
        try
        {
            var application = await _applicationRepository.GetByIdAsync(id);
            if (application == null)
            {
                return ResponseDto<ApplicationDto>.ErrorResult("Başvuru bulunamadı");
            }

            var insurance = await _insuranceRepository.GetByIdAsync(application.InsuranceId);
            var dto = MapToDto(application, insurance?.Name ?? "");

            return ResponseDto<ApplicationDto>.SuccessResult(dto);
        }
        catch (Exception ex)
        {
            return ResponseDto<ApplicationDto>.ErrorResult($"Hata oluştu: {ex.Message}");
        }
    }

    public async Task<ResponseDto<ApplicationDto>> CreateApplicationAsync(CreateApplicationDto dto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.Phone))
            {
                return ResponseDto<ApplicationDto>.ErrorResult("Telefon numarası boş olamaz");
            }

            if (dto.SelectedDate < DateTime.Now.Date)
            {
                return ResponseDto<ApplicationDto>.ErrorResult("Seçilen tarih bugünden önce olamaz");
            }

            var insurance = await _insuranceRepository.GetByIdAsync(dto.InsuranceId);
            if (insurance == null)
            {
                return ResponseDto<ApplicationDto>.ErrorResult("Seçilen sigorta bulunamadı");
            }

            if (!insurance.IsActive)
            {
                return ResponseDto<ApplicationDto>.ErrorResult("Seçilen sigorta aktif değil");
            }

            var application = new ApplicationEntity
            {
                InsuranceId = dto.InsuranceId,
                SelectedDate = dto.SelectedDate,
                Phone = dto.Phone,
                CreatedAt = DateTime.UtcNow
            };

            var createdApplication = await _applicationRepository.AddAsync(application);
            var resultDto = MapToDto(createdApplication, insurance.Name);

            return ResponseDto<ApplicationDto>.SuccessResult(resultDto, "Başvuru başarıyla oluşturuldu");
        }
        catch (Exception ex)
        {
            return ResponseDto<ApplicationDto>.ErrorResult($"Hata oluştu: {ex.Message}");
        }
    }

    public async Task<ResponseDto<List<ApplicationDto>>> GetApplicationsByInsuranceIdAsync(int insuranceId)
    {
        try
        {
            var applications = await _applicationRepository.GetApplicationsByInsuranceIdAsync(insuranceId);
            var insurance = await _insuranceRepository.GetByIdAsync(insuranceId);

            var dto = applications.Select(app => MapToDto(app, insurance?.Name)).ToList();
            return ResponseDto<List<ApplicationDto>>.SuccessResult(dto);
        }
        catch (Exception ex)
        {
            return ResponseDto<List<ApplicationDto>>.ErrorResult($"Hata oluştu: {ex.Message}");
        }
    }

    private static ApplicationDto MapToDto(ApplicationEntity application, string? insuranceName = null)
    {
        return new ApplicationDto
        {
            Id = application.Id,
            InsuranceId = application.InsuranceId,
            InsuranceName = insuranceName ?? application.Insurance?.Name ?? "",
            SelectedDate = application.SelectedDate,
            Phone = application.Phone,
            CreatedAt = application.CreatedAt
        };
    }
}
