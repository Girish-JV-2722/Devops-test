using Microsoft.EntityFrameworkCore;
using ParkingManagement.API.Models;

namespace ParkingManagement.API.Data;

public class ParkingDbContext : DbContext
{
    public ParkingDbContext(DbContextOptions<ParkingDbContext> options) : base(options)
    {
    }

    public DbSet<ParkingSpot> ParkingSpots => Set<ParkingSpot>();
    public DbSet<ParkingTicket> ParkingTickets => Set<ParkingTicket>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed initial parking spots
        var spots = new List<ParkingSpot>();
        var id = 1;

        foreach (var level in new[] { "A", "B", "C" })
        {
            for (var i = 1; i <= 20; i++)
            {
                var type = i switch
                {
                    <= 4 => SpotType.Compact,
                    <= 12 => SpotType.Regular,
                    <= 16 => SpotType.Large,
                    <= 18 => SpotType.Handicapped,
                    _ => SpotType.Electric
                };

                var rate = type switch
                {
                    SpotType.Compact => 2.00m,
                    SpotType.Regular => 3.00m,
                    SpotType.Large => 4.00m,
                    SpotType.Handicapped => 2.50m,
                    SpotType.Electric => 5.00m,
                    _ => 3.00m
                };

                spots.Add(new ParkingSpot
                {
                    Id = id++,
                    SpotNumber = $"{level}{i:D2}",
                    Level = level,
                    Type = type,
                    HourlyRate = rate,
                    IsOccupied = false
                });
            }
        }

        modelBuilder.Entity<ParkingSpot>().HasData(spots);
    }
}

