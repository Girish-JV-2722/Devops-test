import { useEffect, useState } from 'react';
import { ParkingSpot } from '../types';
import { parkingApi } from '../api';
import SpotCard from '../components/SpotCard';

function ParkingLot() {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    loadSpots();
  }, []);

  const loadSpots = async () => {
    try {
      setLoading(true);
      const data = await parkingApi.getAllSpots();
      setSpots(data);
    } catch (error) {
      console.error('Failed to load spots:', error);
    } finally {
      setLoading(false);
    }
  };

  const levels = ['all', ...new Set(spots.map(s => s.level))];
  const types = ['all', ...new Set(spots.map(s => s.type))];

  const filteredSpots = spots.filter(spot => {
    if (selectedLevel !== 'all' && spot.level !== selectedLevel) return false;
    if (filterType !== 'all' && spot.type !== filterType) return false;
    return true;
  });

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

  const totalAvailable = filteredSpots.filter(s => !s.isOccupied).length;
  const totalOccupied = filteredSpots.filter(s => s.isOccupied).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-white mb-2">
            Parking Lot
          </h1>
          <p className="text-gray-400 font-body">
            Visual overview of all parking spots
          </p>
        </div>

        {/* Stats Summary */}
        <div className="flex gap-4">
          <div className="glass-card rounded-xl px-4 py-2 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-white font-display">{totalAvailable}</span>
            <span className="text-gray-400 text-sm">Available</span>
          </div>
          <div className="glass-card rounded-xl px-4 py-2 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-white font-display">{totalOccupied}</span>
            <span className="text-gray-400 text-sm">Occupied</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="glass-card rounded-xl p-2 flex gap-1">
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

        <div className="glass-card rounded-xl p-2 flex gap-1 overflow-x-auto">
          {types.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg font-body text-sm whitespace-nowrap transition-all ${
                filterType === type
                  ? 'bg-parking-accent text-parking-dark font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Parking Grid by Level */}
      {Object.entries(spotsByLevel).map(([level, levelSpots]) => (
        <div key={level} className="glass-card rounded-2xl p-6 neon-border">
          <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-parking-accent/20 rounded-lg flex items-center justify-center text-parking-accent">
              {level}
            </span>
            Level {level}
            <span className="text-sm font-body text-gray-400 font-normal ml-2">
              ({levelSpots.filter(s => !s.isOccupied).length} / {levelSpots.length} available)
            </span>
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-3">
            {levelSpots.map(spot => (
              <SpotCard key={spot.id} spot={spot} selectable={false} />
            ))}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="glass-card rounded-xl p-4">
        <h3 className="font-display text-lg font-bold text-white mb-4">Legend</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 spot-available rounded-lg" />
            <span className="text-gray-400 text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 spot-occupied rounded-lg" />
            <span className="text-gray-400 text-sm">Occupied</span>
          </div>
          <div className="border-l border-gray-700 pl-6 flex flex-wrap gap-4">
            <span className="text-blue-400 text-sm">🚗 Compact</span>
            <span className="text-gray-400 text-sm">🚙 Regular</span>
            <span className="text-orange-400 text-sm">🚛 Large</span>
            <span className="text-purple-400 text-sm">♿ Handicapped</span>
            <span className="text-yellow-400 text-sm">⚡ Electric</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParkingLot;

