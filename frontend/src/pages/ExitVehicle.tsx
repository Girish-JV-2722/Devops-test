import { useState } from 'react';
import { LogOut, Check, AlertCircle, CreditCard, Banknote, Smartphone, Wallet } from 'lucide-react';
import { ParkingTicket, PaymentMethod } from '../types';
import { parkingApi } from '../api';
import Modal from '../components/Modal';

const paymentMethods: { value: PaymentMethod; label: string; icon: typeof CreditCard }[] = [
  { value: 'Cash', label: 'Cash', icon: Banknote },
  { value: 'CreditCard', label: 'Credit Card', icon: CreditCard },
  { value: 'DebitCard', label: 'Debit Card', icon: Wallet },
  { value: 'Mobile', label: 'Mobile Pay', icon: Smartphone },
];

function ExitVehicle() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('Cash');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; ticket?: ParkingTicket; error?: string } | null>(null);

  const handleExit = async () => {
    if (!ticketNumber.trim()) return;

    try {
      setSubmitting(true);
      const ticket = await parkingApi.exitVehicle(ticketNumber.trim(), selectedPayment);
      setResult({ success: true, ticket });
      setTicketNumber('');
    } catch (error) {
      setResult({ success: false, error: 'Ticket not found or already processed. Please check the ticket number.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-bold text-white mb-2">
          Exit Vehicle
        </h1>
        <p className="text-gray-400 font-body">
          Process vehicle exit and payment
        </p>
      </div>

      {/* Exit Form */}
      <div className="max-w-2xl mx-auto">
        <div className="glass-card rounded-2xl p-8 neon-border">
          {/* Ticket Input */}
          <div className="mb-8">
            <label className="block text-gray-400 text-sm mb-2">Ticket Number</label>
            <input
              type="text"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value.toUpperCase())}
              placeholder="e.g., TKT-20231225-ABC12345"
              className="w-full px-4 py-4 bg-parking-dark border border-parking-accent/30 rounded-xl text-white font-mono text-lg focus:outline-none focus:border-parking-accent transition-colors text-center"
            />
          </div>

          {/* Payment Method */}
          <div className="mb-8">
            <label className="block text-gray-400 text-sm mb-4">Payment Method</label>
            <div className="grid grid-cols-2 gap-4">
              {paymentMethods.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setSelectedPayment(value)}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    selectedPayment === value
                      ? 'border-parking-accent bg-parking-accent/10 text-parking-accent'
                      : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:bg-white/5'
                  }`}
                >
                  <Icon size={24} />
                  <span className="font-body font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleExit}
            disabled={!ticketNumber.trim() || submitting}
            className="w-full py-4 bg-parking-accent text-parking-dark font-display font-bold text-lg rounded-xl hover:bg-parking-accent-dim disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
          >
            {submitting ? (
              <div className="w-6 h-6 border-2 border-parking-dark border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogOut size={24} />
                Process Exit
              </>
            )}
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 glass-card rounded-xl p-6">
          <h3 className="font-display text-lg font-bold text-white mb-4">How to Exit</h3>
          <ol className="space-y-3 text-gray-400 font-body">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-parking-accent/20 text-parking-accent rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
              <span>Enter the ticket number from your parking receipt</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-parking-accent/20 text-parking-accent rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
              <span>Select your preferred payment method</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-parking-accent/20 text-parking-accent rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span>
              <span>Click "Process Exit" to complete your payment</span>
            </li>
          </ol>
        </div>
      </div>

      {/* Result Modal */}
      <Modal
        isOpen={!!result}
        onClose={() => setResult(null)}
        title={result?.success ? 'Payment Complete!' : 'Error'}
      >
        {result?.success && result.ticket ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-400" />
            </div>
            <div className="space-y-4">
              <div className="glass-card rounded-xl p-6">
                <p className="text-gray-400 text-sm mb-2">Amount Paid</p>
                <p className="font-display text-4xl font-bold text-parking-accent">
                  ${result.ticket.totalAmount?.toFixed(2)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="glass-card rounded-xl p-4">
                  <p className="text-gray-400 text-xs">Vehicle</p>
                  <p className="font-mono text-white">{result.ticket.vehiclePlate}</p>
                </div>
                <div className="glass-card rounded-xl p-4">
                  <p className="text-gray-400 text-xs">Spot</p>
                  <p className="font-display text-white">{result.ticket.spotNumber}</p>
                </div>
                <div className="glass-card rounded-xl p-4">
                  <p className="text-gray-400 text-xs">Entry</p>
                  <p className="text-white text-sm">
                    {new Date(result.ticket.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="glass-card rounded-xl p-4">
                  <p className="text-gray-400 text-xs">Exit</p>
                  <p className="text-white text-sm">
                    {result.ticket.exitTime && new Date(result.ticket.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <p className="text-gray-500 text-sm">
                Payment Method: {result.ticket.paymentMethod}
              </p>
              <p className="text-green-400 font-body">Thank you! Drive safely!</p>
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

export default ExitVehicle;

