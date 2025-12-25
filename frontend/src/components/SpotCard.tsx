import { ParkingSpot } from '../types';
import { Car, Zap, Accessibility, Truck, CarFront } from 'lucide-react';

interface SpotCardProps {
  spot: ParkingSpot;
  onClick?: (spot: ParkingSpot) => void;
  selectable?: boolean;
}

const typeIcons: Record<string, typeof Car> = {
  Compact: CarFront,
  Regular: Car,
  Large: Truck,
  Handicapped: Accessibility,
  Electric: Zap,
};

const typeColors: Record<string, string> = {
  Compact: 'text-blue-400',
  Regular: 'text-gray-400',
  Large: 'text-orange-400',
  Handicapped: 'text-purple-400',
  Electric: 'text-yellow-400',
};

function SpotCard({ spot, onClick, selectable }: SpotCardProps) {
  const Icon = typeIcons[spot.type] || Car;
  const iconColor = typeColors[spot.type] || 'text-gray-400';

  return (
    <button
      onClick={() => onClick?.(spot)}
      disabled={spot.isOccupied || !selectable}
      className={`
        relative p-4 rounded-xl transition-all duration-300 text-left w-full
        ${spot.isOccupied ? 'spot-occupied' : 'spot-available'}
        ${selectable && !spot.isOccupied ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}
        ${!selectable ? 'opacity-90' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-display font-bold text-lg text-white">
          {spot.spotNumber}
        </span>
        <Icon size={20} className={iconColor} />
      </div>
      
      <div className="text-xs space-y-1">
        <p className="text-gray-300">${spot.hourlyRate}/hr</p>
        {spot.isOccupied && spot.vehiclePlate && (
          <p className="text-red-300 font-mono text-xs truncate">
            {spot.vehiclePlate}
          </p>
        )}
      </div>

      {/* Status indicator */}
      <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
        spot.isOccupied ? 'bg-red-400' : 'bg-green-400 animate-pulse'
      }`} />
    </button>
  );
}

export default SpotCard;

