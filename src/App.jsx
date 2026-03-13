import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Checkout from './pages/payment/Checkout';
import PaymentSuccess from './pages/payment/PaymentSuccess';
import PaymentFailed from './pages/payment/PaymentFailed';
import TransactionHistory from './pages/payment/TransactionHistory';

import AllBookings from './pages/bookings/AllBookings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/payment/checkout" replace />} />
        
        {/* Payment Routes */}
        <Route path="/payment/checkout" element={<Checkout />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failed" element={<PaymentFailed />} />
        <Route path="/payment/history" element={<TransactionHistory />} />

        {/* Admin/Bookings */}
        <Route path="/bookings" element={<AllBookings />} />

        {/* Not Found */}
        <Route path="*" element={<div className="p-5 text-center mt-5"><h2>404 - Page Not Found</h2></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
