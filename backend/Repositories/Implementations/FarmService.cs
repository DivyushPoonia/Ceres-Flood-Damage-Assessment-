using FarmAssessmentAPI.DTOs;
using FarmAssessmentAPI.Models;
using FarmAssessmentAPI.Repositories.Interfaces;
using FarmAssessmentAPI.Services.Interfaces;

namespace FarmAssessmentAPI.Services.Implementations;

public class FarmService : IFarmService
{
    private readonly IFarmRepository _repo;

    public FarmService(IFarmRepository repo)
    {
        _repo = repo;
    }

    public async Task<Guid> CreateAsync(CreateFarmDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Address))
            throw new Exception("Address is required");

        if (dto.ChickenCount <= 0)
            throw new Exception("Invalid chicken count");

        var farm = new Farm
        {
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            Address = dto.Address,
            Condition = dto.Condition,
            ChickenCount = dto.ChickenCount,
            Images = dto.Photos?.Select(p => new FarmImage
            {
                ImageUrl = p
            }).ToList() ?? new List<FarmImage>()
        };

        await _repo.AddAsync(farm);

        return farm.Id;
    }

    public async Task<List<FarmResponseDto>> GetAllAsync()
    {
        var farms = await _repo.GetAllAsync();

        return farms.Select(f => new FarmResponseDto
        {
            Id = f.Id,
            Address = f.Address,
            Condition = f.Condition,
            ChickenCount = f.ChickenCount,
            Latitude = f.Latitude,
            Longitude = f.Longitude,
            CreatedAt = f.CreatedAt,
            Photos = f.Images.Select(i => i.ImageUrl).ToList()
        }).ToList();
    }
}