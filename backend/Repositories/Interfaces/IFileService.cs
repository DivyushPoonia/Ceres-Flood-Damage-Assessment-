namespace FarmAssessmentAPI.Services.Interfaces;

public interface IFileService
{
    Task<string> UploadAsync(IFormFile file);
}