import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { UnsavedChangesProvider } from "./navigation/UnsavedChangesContext";
import "./css/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <UnsavedChangesProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UnsavedChangesProvider>
    </AuthProvider>
  </React.StrictMode>
);
