import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRouter from './router';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="flex-grow">
            <AppRouter />
          </main>

          {/* Footer */}
          <Footer />

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;