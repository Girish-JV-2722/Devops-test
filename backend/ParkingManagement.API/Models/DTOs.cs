namespace ParkingManagement.API.Models;

public record ParkVehicleRequest(string VehiclePlate, int SpotId);
public record ExitVehicleRequest(string TicketNumber, PaymentMethod PaymentMethod);
public record CreateSpotRequest(string SpotNumber, string Level, SpotType Type, decimal HourlyRate);

public record DashboardStats(
    int TotalSpots,
    int OccupiedSpots,
    int AvailableSpots,
    decimal TodayRevenue,
    int TodayVehicles
);

public record SpotDto(
    int Id,
    string SpotNumber,
    string Level,
    string Type,
    bool IsOccupied,
    decimal HourlyRate,
    DateTime? OccupiedSince,
    string? VehiclePlate
);

public record TicketDto(
    int Id,
    string TicketNumber,
    string VehiclePlate,
    string SpotNumber,
    DateTime EntryTime,
    DateTime? ExitTime,
    decimal? TotalAmount,
    bool IsPaid,
    string? PaymentMethod
);

