import { useEffect, useState } from 'react';
import { Ticket, Clock, DollarSign, Check, X } from 'lucide-react';
import { ParkingTicket } from '../types';
import { parkingApi } from '../api';

function Tickets() {
  const [tickets, setTickets] = useState<ParkingTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'paid'>('all');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await parkingApi.getAllTickets();
      setTickets(data);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'active') return !ticket.isPaid;
    if (filter === 'paid') return ticket.isPaid;
    return true;
  });

  const formatDuration = (entryTime: string, exitTime: string | null) => {
    const entry = new Date(entryTime);
    const exit = exitTime ? new Date(exitTime) : new Date();
    const diff = Math.floor((exit.getTime() - entry.getTime()) / 1000 / 60);
    
    if (diff < 60) return `${diff} min`;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-16 h-16 border-4 border-parking-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-white mb-2">
            Tickets
          </h1>
          <p className="text-gray-400 font-body">
            Manage and view parking tickets
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="glass-card rounded-xl p-2 flex gap-1">
          {(['all', 'active', 'paid'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-body text-sm capitalize transition-all ${
                filter === tab
                  ? 'bg-parking-accent text-parking-dark font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab} ({tab === 'all' 
                ? tickets.length 
                : tab === 'active' 
                  ? tickets.filter(t => !t.isPaid).length
                  : tickets.filter(t => t.isPaid).length
              })
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table */}
      <div className="glass-card rounded-2xl neon-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-parking-accent/20">
                <th className="text-left p-4 font-display text-parking-accent">Ticket #</th>
                <th className="text-left p-4 font-display text-parking-accent">Vehicle</th>
                <th className="text-left p-4 font-display text-parking-accent">Spot</th>
                <th className="text-left p-4 font-display text-parking-accent">Entry</th>
                <th className="text-left p-4 font-display text-parking-accent">Duration</th>
                <th className="text-left p-4 font-display text-parking-accent">Amount</th>
                <th className="text-left p-4 font-display text-parking-accent">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    <Ticket size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No tickets found</p>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket, index) => (
                  <tr 
                    key={ticket.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="p-4">
                      <span className="font-mono text-sm text-parking-accent">
                        {ticket.ticketNumber}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono font-bold text-white">
                        {ticket.vehiclePlate}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-parking-accent/20 text-parking-accent rounded-lg text-sm font-display">
                        {ticket.spotNumber}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        {new Date(ticket.entryTime).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="p-4 text-white font-body">
                      {formatDuration(ticket.entryTime, ticket.exitTime)}
                    </td>
                    <td className="p-4">
                      {ticket.totalAmount !== null ? (
                        <span className="flex items-center gap-1 text-green-400 font-display">
                          <DollarSign size={16} />
                          {ticket.totalAmount.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      {ticket.isPaid ? (
                        <span className="flex items-center gap-2 text-green-400">
                          <Check size={16} />
                          <span className="text-sm">Paid</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-amber-400">
                          <X size={16} />
                          <span className="text-sm">Active</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Tickets;

