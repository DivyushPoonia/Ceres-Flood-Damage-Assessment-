namespace FarmAssessmentAPI.Models;

public class FarmImage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid FarmId { get; set; }
    public string ImageUrl { get; set; }
    public Farm Farm { get; set; }
}