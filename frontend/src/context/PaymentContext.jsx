
import React, { createContext, useState, useContext, useCallback } from 'react';
import { getPayments } from '../api/paymentApi';

const PaymentContext = createContext();
export const PaymentContextProvider = ({ children }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPayments();
      setPayments(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch payments');
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <PaymentContext.Provider value={{ payments, setPayments, loading, error, fetchPayments }}>
      {children}
    </PaymentContext.Provider>
  );
};


export const usePaymentContext = () => {
  const context = useContext(PaymentContext);
  if (!context) throw new Error("usePaymentContext must be used within PaymentContextProvider");
  return context;
};