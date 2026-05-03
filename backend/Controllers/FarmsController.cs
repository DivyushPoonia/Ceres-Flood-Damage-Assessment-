using Microsoft.AspNetCore.Mvc;
using FarmAssessmentAPI.Services.Interfaces;
using FarmAssessmentAPI.DTOs;

namespace FarmAssessmentAPI.Controllers;

[ApiController]
[Route("api/farms")]
public class FarmsController : ControllerBase
{
    private readonly IFarmService _service;

    public FarmsController(IFarmService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateFarmDto dto)
    {
        try
        {
            var id = await _service.CreateAsync(dto);
            return Ok(new { id });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var data = await _service.GetAllAsync();
            return Ok(data);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }
}