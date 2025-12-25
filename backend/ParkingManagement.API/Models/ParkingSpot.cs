namespace ParkingManagement.API.Models;

public class ParkingSpot
{
    public int Id { get; set; }
    public string SpotNumber { get; set; } = string.Empty;
    public string Level { get; set; } = string.Empty;
    public SpotType Type { get; set; }
    public bool IsOccupied { get; set; }
    public decimal HourlyRate { get; set; }
    public DateTime? OccupiedSince { get; set; }
    public string? VehiclePlate { get; set; }
}

public enum SpotType
{
    Compact,
    Regular,
    Large,
    Handicapped,
    Electric
}

