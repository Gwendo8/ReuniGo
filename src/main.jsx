import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Admin from "./pages/admin.jsx";
import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import { RefreshProvider } from "./components/others/refreshInfo.jsx";
import Meeting from "./pages/meeting.jsx";

createRoot(document.getElementById("root")).render(
  <RefreshProvider>
    <StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/meeting" element={<Meeting />} />
        </Routes>
      </Router>
    </StrictMode>
  </RefreshProvider>
);
