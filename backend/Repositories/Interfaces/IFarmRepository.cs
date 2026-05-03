using FarmAssessmentAPI.Models;

namespace FarmAssessmentAPI.Repositories.Interfaces;

public interface IFarmRepository
{
    Task AddAsync(Farm farm);
    Task<List<Farm>> GetAllAsync();
}