namespace ParkingManagement.API.Models;

public class ParkingTicket
{
    public int Id { get; set; }
    public string TicketNumber { get; set; } = string.Empty;
    public string VehiclePlate { get; set; } = string.Empty;
    public int ParkingSpotId { get; set; }
    public DateTime EntryTime { get; set; }
    public DateTime? ExitTime { get; set; }
    public decimal? TotalAmount { get; set; }
    public bool IsPaid { get; set; }
    public PaymentMethod? PaymentMethod { get; set; }
}

public enum PaymentMethod
{
    Cash,
    CreditCard,
    DebitCard,
    Mobile
}

