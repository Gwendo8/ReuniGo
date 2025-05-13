import UserInfo from "../components/admin/userInfo";
import "../App.css";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import Navbar from "../components/navbar/navbar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "ADMIN") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 p-4 font-sans">
      <Navbar />
      <motion.h1
        className="text-4xl lg:text-5xl text-center text-blue-700 mb-10 mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        👥 Utilisateurs de l'application
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <UserInfo />
      </motion.div>
    </div>
  );
}

export default Admin;
