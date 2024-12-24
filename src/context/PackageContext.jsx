
import React, { createContext, useState, useContext, useCallback } from 'react';
import { getPackages } from '../api/packageApi';

const PackageContext = createContext();
export const PackageContextProvider = ({ children }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPackages();
      setPackages(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch packages');
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <PackageContext.Provider value={{ packages, setPackages, loading, error, fetchPackages }}>
      {children}
    </PackageContext.Provider>
  );
};


export const usePackageContext = () => {
  const context = useContext(PackageContext);
  if (!context) throw new Error("usePackageContext must be used within PackageContextProvider");
  return context;
};