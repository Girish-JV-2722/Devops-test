using Microsoft.EntityFrameworkCore;
using ParkingManagement.API.Data;
using ParkingManagement.API.Models;

namespace ParkingManagement.API.Services;

public class ParkingService : IParkingService
{
    private readonly ParkingDbContext _context;

    public ParkingService(ParkingDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SpotDto>> GetAllSpotsAsync()
    {
        return await _context.ParkingSpots
            .OrderBy(s => s.Level)
            .ThenBy(s => s.SpotNumber)
            .Select(s => MapToDto(s))
            .ToListAsync();
    }

    public async Task<IEnumerable<SpotDto>> GetAvailableSpotsAsync()
    {
        return await _context.ParkingSpots
            .Where(s => !s.IsOccupied)
            .OrderBy(s => s.Level)
            .ThenBy(s => s.SpotNumber)
            .Select(s => MapToDto(s))
            .ToListAsync();
    }

    public async Task<SpotDto?> GetSpotByIdAsync(int id)
    {
        var spot = await _context.ParkingSpots.FindAsync(id);
        return spot == null ? null : MapToDto(spot);
    }

    public async Task<TicketDto> ParkVehicleAsync(ParkVehicleRequest request)
    {
        var spot = await _context.ParkingSpots.FindAsync(request.SpotId)
            ?? throw new InvalidOperationException("Parking spot not found");

        if (spot.IsOccupied)
            throw new InvalidOperationException("Parking spot is already occupied");

        spot.IsOccupied = true;
        spot.OccupiedSince = DateTime.UtcNow;
        spot.VehiclePlate = request.VehiclePlate;

        var ticket = new ParkingTicket
        {
            TicketNumber = GenerateTicketNumber(),
            VehiclePlate = request.VehiclePlate,
            ParkingSpotId = spot.Id,
            EntryTime = DateTime.UtcNow,
            IsPaid = false
        };

        _context.ParkingTickets.Add(ticket);
        await _context.SaveChangesAsync();

        return MapToDto(ticket, spot.SpotNumber);
    }

    public async Task<TicketDto> ExitVehicleAsync(ExitVehicleRequest request)
    {
        var ticket = await _context.ParkingTickets
            .FirstOrDefaultAsync(t => t.TicketNumber == request.TicketNumber && !t.IsPaid)
            ?? throw new InvalidOperationException("Active ticket not found");

        var spot = await _context.ParkingSpots.FindAsync(ticket.ParkingSpotId)
            ?? throw new InvalidOperationException("Parking spot not found");

        ticket.ExitTime = DateTime.UtcNow;
        var duration = (ticket.ExitTime.Value - ticket.EntryTime).TotalHours;
        ticket.TotalAmount = Math.Ceiling((decimal)duration) * spot.HourlyRate;
        ticket.IsPaid = true;
        ticket.PaymentMethod = request.PaymentMethod;

        spot.IsOccupied = false;
        spot.OccupiedSince = null;
        spot.VehiclePlate = null;

        await _context.SaveChangesAsync();

        return MapToDto(ticket, spot.SpotNumber);
    }

    public async Task<IEnumerable<TicketDto>> GetActiveTicketsAsync()
    {
        return await _context.ParkingTickets
            .Where(t => !t.IsPaid)
            .Join(_context.ParkingSpots,
                t => t.ParkingSpotId,
                s => s.Id,
                (t, s) => MapToDto(t, s.SpotNumber))
            .ToListAsync();
    }

    public async Task<IEnumerable<TicketDto>> GetAllTicketsAsync()
    {
        return await _context.ParkingTickets
            .OrderByDescending(t => t.EntryTime)
            .Join(_context.ParkingSpots,
                t => t.ParkingSpotId,
                s => s.Id,
                (t, s) => MapToDto(t, s.SpotNumber))
            .ToListAsync();
    }

    public async Task<DashboardStats> GetDashboardStatsAsync()
    {
        var today = DateTime.UtcNow.Date;
        var totalSpots = await _context.ParkingSpots.CountAsync();
        var occupiedSpots = await _context.ParkingSpots.CountAsync(s => s.IsOccupied);
        
        var todayTickets = await _context.ParkingTickets
            .Where(t => t.EntryTime.Date == today)
            .ToListAsync();

        var todayRevenue = todayTickets
            .Where(t => t.IsPaid)
            .Sum(t => t.TotalAmount ?? 0);

        return new DashboardStats(
            totalSpots,
            occupiedSpots,
            totalSpots - occupiedSpots,
            todayRevenue,
            todayTickets.Count
        );
    }

    public async Task<SpotDto> CreateSpotAsync(CreateSpotRequest request)
    {
        var spot = new ParkingSpot
        {
            SpotNumber = request.SpotNumber,
            Level = request.Level,
            Type = request.Type,
            HourlyRate = request.HourlyRate,
            IsOccupied = false
        };

        _context.ParkingSpots.Add(spot);
        await _context.SaveChangesAsync();

        return MapToDto(spot);
    }

    private static string GenerateTicketNumber()
    {
        return $"TKT-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}";
    }

    private static SpotDto MapToDto(ParkingSpot spot) => new(
        spot.Id,
        spot.SpotNumber,
        spot.Level,
        spot.Type.ToString(),
        spot.IsOccupied,
        spot.HourlyRate,
        spot.OccupiedSince,
        spot.VehiclePlate
    );

    private static TicketDto MapToDto(ParkingTicket ticket, string spotNumber) => new(
        ticket.Id,
        ticket.TicketNumber,
        ticket.VehiclePlate,
        spotNumber,
        ticket.EntryTime,
        ticket.ExitTime,
        ticket.TotalAmount,
        ticket.IsPaid,
        ticket.PaymentMethod?.ToString()
    );
}

