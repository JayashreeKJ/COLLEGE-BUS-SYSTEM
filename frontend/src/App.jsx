import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { SimulationProvider } from './context/SimulationContext';
import ToastContainer from './components/common/ToastContainer';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LoadingScreen from './components/common/LoadingScreen';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  const [hasLoaded, setHasLoaded] = useState(() => {
    // Show splash screen on first visit per session
    return sessionStorage.getItem('smartbus_loaded') === 'true';
  });

  const handleLoadingComplete = () => {
    sessionStorage.setItem('smartbus_loaded', 'true');
    setHasLoaded(true);
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <SimulationProvider>
            {!hasLoaded && <LoadingScreen onComplete={handleLoadingComplete} />}
            <BrowserRouter>
              <div className="app-container">
                <Header />
                <AppRoutes />
                <Footer />
                <ToastContainer />
              </div>
            </BrowserRouter>
          </SimulationProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
