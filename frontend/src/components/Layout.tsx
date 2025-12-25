import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ParkingSquare, 
  Ticket, 
  CarFront, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/parking-lot', icon: ParkingSquare, label: 'Parking Lot' },
  { to: '/park', icon: CarFront, label: 'Park Vehicle' },
  { to: '/exit', icon: LogOut, label: 'Exit Vehicle' },
  { to: '/tickets', icon: Ticket, label: 'Tickets' },
];

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 glass-card neon-border">
        <div className="p-6 border-b border-parking-accent/20">
          <h1 className="font-display text-3xl font-bold text-gradient">
            ParkFlow
          </h1>
          <p className="text-gray-400 text-sm mt-1 font-body">
            Smart Parking Management
          </p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-body font-medium ${
                  isActive
                    ? 'bg-parking-accent/20 text-parking-accent neon-border'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={22} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-parking-accent/20">
          <div className="glass-card rounded-xl p-4">
            <p className="text-xs text-gray-500 font-body">System Status</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-green-400">Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-card border-b border-parking-accent/20 p-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-gradient">ParkFlow</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-parking-accent p-2"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-parking-darker/95 pt-20">
          <nav className="p-4 space-y-2">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-300 font-body text-lg ${
                    isActive
                      ? 'bg-parking-accent/20 text-parking-accent'
                      : 'text-gray-400'
                  }`
                }
              >
                <Icon size={24} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:p-8 p-4 pt-20 lg:pt-8 overflow-auto">
        <div className="max-w-7xl mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;

