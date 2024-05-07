import React ,{ useCallback, createContext, useContext } from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { AuthProvider as OriginalAuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { RouterProvider } from 'react-router-dom';
import ContextProvider from "./context/ContextProvider";
import router from "./routes/routes";
import App from "./App";
import Modal from 'react-modal'
Modal.setAppElement('#root')

const UnauthorizedContext = createContext();

export const useUnauthorized = () => useContext(UnauthorizedContext);

const AuthProviderWithUnauthorized = ({ children }) => {
  const onUnauthorized = useUnauthorized();

  const handleUnauthorized = useCallback(() => {
    router.navigate("/registration");
  }, []);

  return (
    <UnauthorizedContext.Provider value={handleUnauthorized}>
      <OriginalAuthProvider onUnauthorized={onUnauthorized}>{children}</OriginalAuthProvider>
    </UnauthorizedContext.Provider>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ToastProvider> 
    <AuthProviderWithUnauthorized> 
      <RouterProvider router={router}>
        <ContextProvider>
          <App />
        </ContextProvider>
      </RouterProvider>
    </AuthProviderWithUnauthorized>
  </ToastProvider>
);