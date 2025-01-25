using Microsoft.AspNetCore.Mvc;
using NovaSigorta.Application.DTOs;
using NovaSigorta.Application.Interfaces;

namespace NovaSigorta.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PublicController : ControllerBase
{
    private readonly IInsuranceService _insuranceService;
    private readonly IApplicationService _applicationService;

    public PublicController(
        IInsuranceService insuranceService,
        IApplicationService applicationService)
    {
        _insuranceService = insuranceService;
        _applicationService = applicationService;
    }

    [HttpGet("insurances")]
    public async Task<ActionResult<ResponseDto<List<InsuranceDto>>>> GetActiveInsurances()
    {
        var result = await _insuranceService.GetActiveInsurancesAsync();

        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    [HttpPost("applications")]
    public async Task<ActionResult<ResponseDto<ApplicationDto>>> CreateApplication([FromBody] CreateApplicationDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ResponseDto<ApplicationDto>.ErrorResult("Geçersiz veri"));
        }

        var result = await _applicationService.CreateApplicationAsync(dto);

        if (result.Success)
        {
            return CreatedAtAction(nameof(GetApplication), new { id = result.Data?.Id }, result);
        }

        return BadRequest(result);
    }

    [HttpGet("applications/{id}")]
    public async Task<ActionResult<ResponseDto<ApplicationDto>>> GetApplication(int id)
    {
        var result = await _applicationService.GetApplicationByIdAsync(id);

        if (result.Success)
        {
            return Ok(result);
        }

        return NotFound(result);
    }
}
