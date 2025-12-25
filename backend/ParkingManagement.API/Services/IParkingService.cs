using ParkingManagement.API.Models;

namespace ParkingManagement.API.Services;

public interface IParkingService
{
    Task<IEnumerable<SpotDto>> GetAllSpotsAsync();
    Task<IEnumerable<SpotDto>> GetAvailableSpotsAsync();
    Task<SpotDto?> GetSpotByIdAsync(int id);
    Task<TicketDto> ParkVehicleAsync(ParkVehicleRequest request);
    Task<TicketDto> ExitVehicleAsync(ExitVehicleRequest request);
    Task<IEnumerable<TicketDto>> GetActiveTicketsAsync();
    Task<IEnumerable<TicketDto>> GetAllTicketsAsync();
    Task<DashboardStats> GetDashboardStatsAsync();
    Task<SpotDto> CreateSpotAsync(CreateSpotRequest request);
}

