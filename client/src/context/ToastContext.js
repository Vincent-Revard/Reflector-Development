import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ type: '', message: null });

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: '', message: null }), 3000); // auto-hide after 3 seconds
  }, []);

  return (
    <ToastContext.Provider value={{
      error: (msg) => showToast('error', msg),
    }}>
      {children}
      {toast.message && <div className={`toast ${toast.type}`}>{toast.message}</div>}    </ToastContext.Provider>
  );
};