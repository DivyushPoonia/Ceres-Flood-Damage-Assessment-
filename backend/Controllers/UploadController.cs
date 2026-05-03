using Microsoft.AspNetCore.Mvc;
using FarmAssessmentAPI.Services.Interfaces;

namespace FarmAssessmentAPI.Controllers;

[ApiController]
[Route("api/upload")]
public class UploadController : ControllerBase
{
    private readonly IFileService _fileService;

    public UploadController(IFileService fileService)
    {
        _fileService = fileService;
    }

    [HttpPost]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        try
        {
            var url = await _fileService.UploadAsync(file);
            return Ok(url);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

}