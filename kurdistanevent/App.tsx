
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { MapsApiStatusProvider } from './context/MapsApiStatusContext';
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import CreateEventPage from './pages/CreateEventPage';
import EventDetailsPage from './pages/EventDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import MessagesPage from './pages/MessagesPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <MapsApiStatusProvider>
          <HashRouter>
            <div className="min-h-screen flex flex-col text-text-primary dark:text-dark-text-primary">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/welcome" element={<WelcomePage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  
                  <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                  <Route path="/create-event" element={<ProtectedRoute><CreateEventPage /></ProtectedRoute>} />
                  <Route path="/event/:id" element={<ProtectedRoute><EventDetailsPage /></ProtectedRoute>} />
                  <Route path="/messages/:userId" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />

                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
            </div>
          </HashRouter>
        </MapsApiStatusProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
