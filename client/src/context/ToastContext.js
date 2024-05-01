import React, { createContext, useContext, useState, useCallback } from 'react';
import '../index.css';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ type: '', message: null });
  const [isVisible, setIsVisible] = useState(false);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setIsVisible(true);
    setTimeout(() => {
      setToast({ type: '', message: null });
      setIsVisible(false);
    }, 5000); // auto-hide after 3 seconds
  }, []);

  return (
    <ToastContext.Provider value={{
      showToast,
    }}>
      {children}
      {isVisible && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </ToastContext.Provider>
  );
};