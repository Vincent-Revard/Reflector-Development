import React from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./components/context/AuthContext";
import { ToastProvider } from './context/ToastContext'; // Create + Import ToastProvider
import { RouterProvider } from 'react-router-dom';
import router from "./routes/routes";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <AuthProvider> 
    <ToastProvider> 
      <RouterProvider router={router} />
    </ToastProvider>
  </AuthProvider>
);