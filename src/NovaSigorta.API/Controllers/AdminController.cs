using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaSigorta.Application.DTOs;
using NovaSigorta.Application.Interfaces;

namespace NovaSigorta.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IInsuranceService _insuranceService;
    private readonly IApplicationService _applicationService;
    private readonly IAdminService _adminService;

    public AdminController(
        IInsuranceService insuranceService,
        IApplicationService applicationService,
        IAdminService adminService)
    {
        _insuranceService = insuranceService;
        _applicationService = applicationService;
        _adminService = adminService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AdminLoginResponseDto>> Login([FromBody] AdminLoginDto dto)
    {
        var result = await _adminService.LoginAsync(dto);

        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<ActionResult<ResponseDto<AdminDto>>> GetProfile()
    {
        var username = User.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            return Unauthorized("Geçersiz token");
        }

        var result = await _adminService.GetAdminProfileAsync(username);

        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    #region Insurance Management

    [HttpGet("insurances")]
    [Authorize]
    public async Task<ActionResult<ResponseDto<List<InsuranceDto>>>> GetAllInsurances()
    {
        var result = await _insuranceService.GetAllInsurancesAsync();

        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    [HttpGet("insurances/{id}")]
    [Authorize]
    public async Task<ActionResult<ResponseDto<InsuranceDto>>> GetInsurance(int id)
    {
        var result = await _insuranceService.GetInsuranceByIdAsync(id);

        if (result.Success)
        {
            return Ok(result);
        }

        return NotFound(result);
    }

    [HttpPost("insurances")]
    [Authorize]
    public async Task<ActionResult<ResponseDto<InsuranceDto>>> CreateInsurance([FromBody] CreateInsuranceDto dto)
    {
        var result = await _insuranceService.CreateInsuranceAsync(dto);

        if (result.Success)
        {
            return CreatedAtAction(nameof(GetInsurance), new { id = result.Data?.Id }, result);
        }

        return BadRequest(result);
    }

    [HttpPut("insurances/{id}")]
    [Authorize]
    public async Task<ActionResult<ResponseDto<InsuranceDto>>> UpdateInsurance(int id, [FromBody] UpdateInsuranceDto dto)
    {
        var result = await _insuranceService.UpdateInsuranceAsync(id, dto);

        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    [HttpDelete("insurances/{id}")]
    [Authorize]
    public async Task<ActionResult<ResponseDto>> DeleteInsurance(int id)
    {
        var result = await _insuranceService.DeleteInsuranceAsync(id);

        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    [HttpPatch("insurances/{id}/toggle")]
    [Authorize]
    public async Task<ActionResult<ResponseDto>> ToggleInsuranceStatus(int id)
    {
        var result = await _insuranceService.ToggleInsuranceStatusAsync(id);

        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    #endregion

    #region Application Management

    [HttpGet("applications")]
    [Authorize]
    public async Task<ActionResult<ResponseDto<List<ApplicationDto>>>> GetAllApplications()
    {
        var result = await _applicationService.GetAllApplicationsAsync();

        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    [HttpGet("applications/{id}")]
    [Authorize]
    public async Task<ActionResult<ResponseDto<ApplicationDto>>> GetApplication(int id)
    {
        var result = await _applicationService.GetApplicationByIdAsync(id);

        if (result.Success)
        {
            return Ok(result);
        }

        return NotFound(result);
    }

    [HttpGet("insurances/{insuranceId}/applications")]
    [Authorize]
    public async Task<ActionResult<ResponseDto<List<ApplicationDto>>>> GetApplicationsByInsurance(int insuranceId)
    {
        var result = await _applicationService.GetApplicationsByInsuranceIdAsync(insuranceId);

        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    #endregion
}