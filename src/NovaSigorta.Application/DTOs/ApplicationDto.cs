namespace NovaSigorta.Application.DTOs;

public class ApplicationDto
{
    public int Id { get; set; }
    public int InsuranceId { get; set; }
    public string InsuranceName { get; set; } = string.Empty;
    public DateTime SelectedDate { get; set; }
    public string Phone { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateApplicationDto
{
    public int InsuranceId { get; set; }
    public DateTime SelectedDate { get; set; }
    public string Phone { get; set; } = string.Empty;
}
