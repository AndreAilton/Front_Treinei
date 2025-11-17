import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./global/index.css";
import MainRoutes from "./routes";
import { AuthProvider } from "./context/AuthContext";
import NavBar from "./components/Navbar";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <MainRoutes />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
