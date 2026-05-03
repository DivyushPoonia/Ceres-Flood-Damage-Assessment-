using Microsoft.EntityFrameworkCore;
using FarmAssessmentAPI.Models;

namespace FarmAssessmentAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Farm> Farms => Set<Farm>();
    public DbSet<FarmImage> FarmImages => Set<FarmImage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Farm>()
            .HasMany(f => f.Images)
            .WithOne(i => i.Farm)
            .HasForeignKey(i => i.FarmId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}