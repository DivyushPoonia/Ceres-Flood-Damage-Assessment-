using FarmAssessmentAPI.Data;
using FarmAssessmentAPI.Models;
using FarmAssessmentAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FarmAssessmentAPI.Repositories.Implementations;

public class FarmRepository : IFarmRepository
{
    private readonly AppDbContext _context;

    public FarmRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Farm farm)
    {
        await _context.Farms.AddAsync(farm);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Farm>> GetAllAsync()
    {
        return await _context.Farms
            .Include(f => f.Images)
            .OrderByDescending(f => f.CreatedAt)
            .ToListAsync();
    }
}