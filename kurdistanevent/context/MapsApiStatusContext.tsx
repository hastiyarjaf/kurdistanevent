import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

interface MapsApiStatusContextType {
  hasAuthError: boolean;
}

const MapsApiStatusContext = createContext<MapsApiStatusContextType | undefined>(undefined);

export const MapsApiStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hasAuthError, setHasAuthError] = useState(false);

  useEffect(() => {
    const handleAuthFailure = () => {
      console.error("Google Maps Authentication Failure. Check your API key and Google Cloud project configuration.");
      setHasAuthError(true);
    };

    // The official way to listen for auth errors from the Maps JS API
    window.addEventListener('gm-auth-failure', handleAuthFailure);

    return () => {
      window.removeEventListener('gm-auth-failure', handleAuthFailure);
    };
  }, []);

  return (
    <MapsApiStatusContext.Provider value={{ hasAuthError }}>
      {children}
    </MapsApiStatusContext.Provider>
  );
};

export const useMapsApiStatus = () => {
  const context = useContext(MapsApiStatusContext);
  if (context === undefined) {
    throw new Error('useMapsApiStatus must be used within a MapsApiStatusProvider');
  }
  return context;
};
