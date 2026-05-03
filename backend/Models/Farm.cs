namespace FarmAssessmentAPI.Models;

public class Farm
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string Address { get; set; }
    public string Condition { get; set; }
    public int ChickenCount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<FarmImage> Images { get; set; } = new();
}