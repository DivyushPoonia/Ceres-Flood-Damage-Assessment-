namespace FarmAssessmentAPI.DTOs;

public class FarmResponseDto
{
    public Guid Id { get; set; }
    public string Address { get; set; }
    public string Condition { get; set; }
    public int ChickenCount { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<string> Photos { get; set; }
}