import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useAuth } from '../context/AuthContext';

interface RegistrationState {
  eventId: number;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventImg: string;
  ticketType: string;
  quantity: number;
  pricePerTicket: number;
}

const VAT_RATE = 0.06;

const formatNGN = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const EventRegistration: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const { isLoggedIn, logout } = useAuth();

  const state = location.state as RegistrationState | null;

  // Guard: redirect if no state passed
  if (!state) {
    navigate(`/events/${eventId}`, { replace: true });
    return null;
  }

  const [qty, setQty] = useState<number>(state.quantity);

  const pricePerTicket = state.pricePerTicket;
  const subtotal = pricePerTicket * qty;
  const vat = Math.round(subtotal * VAT_RATE * 100) / 100;
  const total = subtotal + vat;

  const ticketLabel = `${state.eventName} _ ${state.ticketType.charAt(0).toUpperCase() + state.ticketType.slice(1)} Ticket`;

  const handleQtyChange = (value: number) => {
    if (value >= 1 && value <= 10) {
      setQty(value);
    }
  };

  const handleRemove = () => {
    navigate(`/events/${eventId}`);
  };

  const handleBuyTickets = () => {
    navigate(`/events/${eventId}/checkout`, {
      state: {
        ...state,
        quantity: qty,
        subtotal,
        vat,
        total,
        ticketLabel,
      },
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Navbar
        onProfileClick={() => navigate('/dashboard')}
        onLogoClick={() => navigate('/')}
        onListingsClick={() => navigate('/listings')}
        onContactClick={() => navigate('/contact')}
        onEventsClick={() => navigate('/events')}
        onAddBusinessClick={() => navigate('/add-business')}
        onShopClick={() => navigate('/shop')}
        onLoginClick={() => navigate('/')}
        onSignupClick={() => navigate('/')}
        isLoggedIn={isLoggedIn}
        onLogoutClick={() => { logout(); navigate('/'); }}
      />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Event Registration</h1>
          <hr className="border-gray-200 mb-8" />

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Cart Table */}
            <div className="flex-1">
              {/* Table */}
              <div className="border border-gray-200 rounded">
                {/* Table Header */}
                <div className="grid grid-cols-[1fr_auto_auto_auto_auto] bg-gray-50 border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 gap-4">
                  <span>Product</span>
                  <span className="w-28 text-center">Price</span>
                  <span className="w-20 text-center">Qty</span>
                  <span className="w-28 text-center">Subtotal</span>
                  <span className="w-8"></span>
                </div>

                {/* Table Row */}
                <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center px-4 py-4 gap-4">
                  {/* Remove button */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleRemove}
                      className="w-6 h-6 rounded-full border-2 border-red-500 text-red-500 flex items-center justify-center flex-shrink-0 hover:bg-red-50 transition-colors"
                      aria-label="Remove item"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={state.eventImg}
                        alt={state.eventName}
                        className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    {/* Name */}
                    <span className="text-sm font-medium text-gray-800">{ticketLabel}</span>
                  </div>

                  {/* Price */}
                  <span className="w-28 text-center text-sm text-gray-700">{formatNGN(pricePerTicket)}</span>

                  {/* Qty input */}
                  <div className="w-20 flex justify-center">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={qty}
                      onChange={e => handleQtyChange(parseInt(e.target.value, 10) || 1)}
                      className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Subtotal */}
                  <span className="w-28 text-center text-sm font-semibold text-gray-800">{formatNGN(subtotal)}</span>

                  {/* Empty (remove is in product col) */}
                  <span className="w-8"></span>
                </div>
              </div>

              {/* Info row below table */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 px-1 gap-2">
                <p className="text-blue-600 text-sm">
                  Your Ticket will be sent to your mail one payment is successful
                </p>
                <p className="text-sm text-gray-700">
                  Subtotal: <span className="font-bold text-gray-900">{formatNGN(subtotal)}</span>
                </p>
              </div>

              {/* Buy Tickets button */}
              <div className="mt-6">
                <button
                  onClick={handleBuyTickets}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-8 py-3 transition-colors"
                >
                  BUY TICKETS
                </button>
              </div>
            </div>

            {/* Right: Cart Total Sidebar */}
            <div className="lg:w-72 flex-shrink-0">
              <div className="border border-gray-200 rounded p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Cart Total</h2>
                <hr className="border-gray-200 mb-4" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">{formatNGN(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Value Added Tax</span>
                    <span className="font-semibold text-gray-900">{formatNGN(vat)}</span>
                  </div>
                </div>

                <hr className="border-gray-200 my-4" />

                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900 text-base">
                    {total.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NGN
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventRegistration;
