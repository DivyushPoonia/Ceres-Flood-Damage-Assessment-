using FarmAssessmentAPI.DTOs;

namespace FarmAssessmentAPI.Services.Interfaces;

public interface IFarmService
{
    Task<Guid> CreateAsync(CreateFarmDto dto);
    Task<List<FarmResponseDto>> GetAllAsync();
}