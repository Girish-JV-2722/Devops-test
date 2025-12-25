import { useEffect, useState } from 'react';
import { Car, Check, AlertCircle } from 'lucide-react';
import { ParkingSpot, ParkingTicket } from '../types';
import { parkingApi } from '../api';
import SpotCard from '../components/SpotCard';
import Modal from '../components/Modal';

function ParkVehicle() {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; ticket?: ParkingTicket; error?: string } | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  useEffect(() => {
    loadSpots();
  }, []);

  const loadSpots = async () => {
    try {
      setLoading(true);
      const data = await parkingApi.getAvailableSpots();
      setSpots(data);
    } catch (error) {
      console.error('Failed to load spots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePark = async () => {
    if (!selectedSpot || !vehiclePlate.trim()) return;

    try {
      setSubmitting(true);
      const ticket = await parkingApi.parkVehicle(vehiclePlate.toUpperCase(), selectedSpot.id);
      setResult({ success: true, ticket });
      setVehiclePlate('');
      setSelectedSpot(null);
      loadSpots(); // Refresh available spots
    } catch (error) {
      setResult({ success: false, error: 'Failed to park vehicle. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const levels = ['all', ...new Set(spots.map(s => s.level))];
  const filteredSpots = selectedLevel === 'all' 
    ? spots 
    : spots.filter(s => s.level === selectedLevel);

  const spotsByLevel = filteredSpots.reduce((acc, spot) => {
    if (!acc[spot.level]) acc[spot.level] = [];
    acc[spot.level].push(spot);
    return acc;
  }, {} as Record<string, ParkingSpot[]>);

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
      <div>
        <h1 className="font-display text-4xl font-bold text-white mb-2">
          Park Vehicle
        </h1>
        <p className="text-gray-400 font-body">
          Select an available spot and enter vehicle details
        </p>
      </div>

      {/* Vehicle Plate Input */}
      <div className="glass-card rounded-2xl p-6 neon-border">
        <h2 className="font-display text-xl font-bold text-white mb-4">
          Vehicle Information
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-gray-400 text-sm mb-2">License Plate</label>
            <input
              type="text"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
              placeholder="Enter license plate"
              className="w-full px-4 py-3 bg-parking-dark border border-parking-accent/30 rounded-xl text-white font-mono text-lg focus:outline-none focus:border-parking-accent transition-colors"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-400 text-sm mb-2">Selected Spot</label>
            <div className="px-4 py-3 bg-parking-dark border border-parking-accent/30 rounded-xl text-white font-display text-lg">
              {selectedSpot ? (
                <span className="text-parking-accent">{selectedSpot.spotNumber} - ${selectedSpot.hourlyRate}/hr</span>
              ) : (
                <span className="text-gray-500">Select a spot below</span>
              )}
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={handlePark}
              disabled={!selectedSpot || !vehiclePlate.trim() || submitting}
              className="w-full md:w-auto px-8 py-3 bg-parking-accent text-parking-dark font-display font-bold rounded-xl hover:bg-parking-accent-dim disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-parking-dark border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Car size={20} />
                  Park Vehicle
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Level Filter */}
      <div className="glass-card rounded-xl p-2 flex gap-1 w-fit">
        {levels.map(level => (
          <button
            key={level}
            onClick={() => setSelectedLevel(level)}
            className={`px-4 py-2 rounded-lg font-body text-sm transition-all ${
              selectedLevel === level
                ? 'bg-parking-accent text-parking-dark font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {level === 'all' ? 'All Levels' : `Level ${level}`}
          </button>
        ))}
      </div>

      {/* Available Spots */}
      {spots.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-amber-400" />
          <p className="text-xl text-white font-display mb-2">No Available Spots</p>
          <p className="text-gray-400">All parking spots are currently occupied</p>
        </div>
      ) : (
        Object.entries(spotsByLevel).map(([level, levelSpots]) => (
          <div key={level} className="glass-card rounded-2xl p-6 neon-border">
            <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-parking-accent/20 rounded-lg flex items-center justify-center text-parking-accent">
                {level}
              </span>
              Level {level}
              <span className="text-sm font-body text-gray-400 font-normal ml-2">
                ({levelSpots.length} available)
              </span>
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-3">
              {levelSpots.map(spot => (
                <div
                  key={spot.id}
                  className={`rounded-xl transition-all ${
                    selectedSpot?.id === spot.id ? 'ring-2 ring-parking-accent ring-offset-2 ring-offset-parking-dark' : ''
                  }`}
                >
                  <SpotCard 
                    spot={spot} 
                    onClick={setSelectedSpot}
                    selectable={true}
                  />
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Result Modal */}
      <Modal
        isOpen={!!result}
        onClose={() => setResult(null)}
        title={result?.success ? 'Vehicle Parked Successfully!' : 'Error'}
      >
        {result?.success && result.ticket ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-400" />
            </div>
            <div className="space-y-4">
              <div className="glass-card rounded-xl p-4">
                <p className="text-gray-400 text-sm">Ticket Number</p>
                <p className="font-mono text-xl text-parking-accent">{result.ticket.ticketNumber}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card rounded-xl p-4">
                  <p className="text-gray-400 text-sm">Vehicle</p>
                  <p className="font-mono text-lg text-white">{result.ticket.vehiclePlate}</p>
                </div>
                <div className="glass-card rounded-xl p-4">
                  <p className="text-gray-400 text-sm">Spot</p>
                  <p className="font-display text-lg text-white">{result.ticket.spotNumber}</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm">
                Entry Time: {new Date(result.ticket.entryTime).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-400" />
            </div>
            <p className="text-red-400">{result?.error}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ParkVehicle;

