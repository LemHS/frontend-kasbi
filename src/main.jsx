import React from "react";
import ReactDOM from "react-dom/client";
// REMOVED: import { BrowserRouter } ...
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./styles/global.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* We removed <BrowserRouter> here.
         Since App.jsx already has it, we don't need it here.
         AuthProvider sits outside the router, which is fine for storing state.
      */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);