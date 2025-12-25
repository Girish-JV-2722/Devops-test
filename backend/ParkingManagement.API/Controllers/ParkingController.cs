using Microsoft.AspNetCore.Mvc;
using ParkingManagement.API.Models;
using ParkingManagement.API.Services;

namespace ParkingManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ParkingController : ControllerBase
{
    private readonly IParkingService _parkingService;

    public ParkingController(IParkingService parkingService)
    {
        _parkingService = parkingService;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardStats>> GetDashboard()
    {
        var stats = await _parkingService.GetDashboardStatsAsync();
        return Ok(stats);
    }

    [HttpGet("spots")]
    public async Task<ActionResult<IEnumerable<SpotDto>>> GetAllSpots()
    {
        var spots = await _parkingService.GetAllSpotsAsync();
        return Ok(spots);
    }

    [HttpGet("spots/available")]
    public async Task<ActionResult<IEnumerable<SpotDto>>> GetAvailableSpots()
    {
        var spots = await _parkingService.GetAvailableSpotsAsync();
        return Ok(spots);
    }

    [HttpGet("spots/{id}")]
    public async Task<ActionResult<SpotDto>> GetSpot(int id)
    {
        var spot = await _parkingService.GetSpotByIdAsync(id);
        if (spot == null)
            return NotFound();
        return Ok(spot);
    }

    [HttpPost("spots")]
    public async Task<ActionResult<SpotDto>> CreateSpot([FromBody] CreateSpotRequest request)
    {
        var spot = await _parkingService.CreateSpotAsync(request);
        return CreatedAtAction(nameof(GetSpot), new { id = spot.Id }, spot);
    }

    [HttpPost("park")]
    public async Task<ActionResult<TicketDto>> ParkVehicle([FromBody] ParkVehicleRequest request)
    {
        try
        {
            var ticket = await _parkingService.ParkVehicleAsync(request);
            return Ok(ticket);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("exit")]
    public async Task<ActionResult<TicketDto>> ExitVehicle([FromBody] ExitVehicleRequest request)
    {
        try
        {
            var ticket = await _parkingService.ExitVehicleAsync(request);
            return Ok(ticket);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("tickets")]
    public async Task<ActionResult<IEnumerable<TicketDto>>> GetAllTickets()
    {
        var tickets = await _parkingService.GetAllTicketsAsync();
        return Ok(tickets);
    }

    [HttpGet("tickets/active")]
    public async Task<ActionResult<IEnumerable<TicketDto>>> GetActiveTickets()
    {
        var tickets = await _parkingService.GetActiveTicketsAsync();
        return Ok(tickets);
    }
}

