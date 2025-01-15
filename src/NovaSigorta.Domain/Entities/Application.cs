namespace NovaSigorta.Domain.Entities;

public class Application
{
    public int Id { get; set; }
    public int InsuranceId { get; set; }
    public DateTime SelectedDate { get; set; }
    public string Phone { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Insurance Insurance { get; set; } = null!;
}
