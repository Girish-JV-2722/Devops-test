import { useEffect, useState } from 'react';
import { ParkingSquare, Car, DollarSign, TrendingUp } from 'lucide-react';
import { DashboardStats, ParkingTicket } from '../types';
import { parkingApi } from '../api';
import StatCard from '../components/StatCard';

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTickets, setRecentTickets] = useState<ParkingTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, tickets] = await Promise.all([
        parkingApi.getDashboard(),
        parkingApi.getActiveTickets(),
      ]);
      setStats(dashboardStats);
      setRecentTickets(tickets.slice(0, 5));
      setError(null);
    } catch {
      setError('Failed to load dashboard data. Make sure the API is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-16 h-16 border-4 border-parking-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-6 py-2 bg-parking-accent text-parking-dark rounded-lg font-semibold hover:bg-parking-accent-dim transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-bold text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-400 font-body">
          Real-time overview of your parking facility
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Spots"
          value={stats?.totalSpots || 0}
          icon={ParkingSquare}
          color="blue"
        />
        <StatCard
          title="Available"
          value={stats?.availableSpots || 0}
          icon={ParkingSquare}
          color="accent"
        />
        <StatCard
          title="Occupied"
          value={stats?.occupiedSpots || 0}
          icon={Car}
          color="warning"
        />
        <StatCard
          title="Today's Revenue"
          value={`$${stats?.todayRevenue?.toFixed(2) || '0.00'}`}
          icon={DollarSign}
          color="accent"
        />
      </div>

      {/* Quick Stats & Active Vehicles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy Chart */}
        <div className="glass-card rounded-2xl p-6 neon-border">
          <h3 className="font-display text-xl font-bold text-white mb-6">
            Occupancy Rate
          </h3>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#1f2937"
                  strokeWidth="16"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#00d4aa"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${((stats?.occupiedSpots || 0) / (stats?.totalSpots || 1)) * 502} 502`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-4xl font-bold text-white">
                  {stats?.totalSpots ? Math.round((stats.occupiedSpots / stats.totalSpots) * 100) : 0}%
                </span>
                <span className="text-gray-400 text-sm">Occupied</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-parking-accent rounded-full" />
              <span className="text-gray-400 text-sm">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-700 rounded-full" />
              <span className="text-gray-400 text-sm">Available</span>
            </div>
          </div>
        </div>

        {/* Active Vehicles */}
        <div className="glass-card rounded-2xl p-6 neon-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl font-bold text-white">
              Active Vehicles
            </h3>
            <div className="flex items-center gap-2 text-parking-accent">
              <TrendingUp size={20} />
              <span className="font-body text-sm">{stats?.todayVehicles || 0} today</span>
            </div>
          </div>
          
          {recentTickets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Car size={48} className="mx-auto mb-4 opacity-50" />
              <p>No active vehicles</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-parking-accent/20 rounded-lg">
                      <Car size={20} className="text-parking-accent" />
                    </div>
                    <div>
                      <p className="font-mono font-bold text-white">
                        {ticket.vehiclePlate}
                      </p>
                      <p className="text-xs text-gray-500">
                        Spot {ticket.spotNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      {new Date(ticket.entryTime).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                    <p className="text-xs text-parking-accent">
                      {ticket.ticketNumber}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

