import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import ScrollToTop from './components/common/ScrollToTop';
import FloatingWhatsApp from './components/common/FloatingWhatsApp';
import BackToTop from './components/common/BackToTop';

function App() {
  return (
    <BrowserRouter>
      {/* Auto scroll window to top on route change */}
      <ScrollToTop />
      
      {/* Main Routed Content */}
      <div className="page-transition-wrapper">
        <AppRoutes />
      </div>

      {/* Floating Direct WhatsApp CTA with Live Pulse */}
      <FloatingWhatsApp />

      {/* Smooth Back to Top Button */}
      <BackToTop />
    </BrowserRouter>
  );
}

export default App;
