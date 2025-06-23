import { useContext, useEffect } from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import UserInfo from "../components/admin/userInfo";
import Navbar from "../components/navbar/navbar";
import { ThemeContext } from "../components/others/themeContext";

function Admin() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "ADMIN") {
      navigate("/login");
    }
  }, [navigate]);

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div
      className={`min-h-screen p-4 font-sans ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900"
          : "bg-gradient-to-br from-white via-blue-50 to-blue-100"
      }`}
    >
      <Navbar />
      <div className="pt-8 lg:pb-3 ml-10">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Titre */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center mb-6 lg:mb-0">
              <div
                className={`hidden sm:flex items-center justify-center w-12 h-12 rounded-xl shadow-lg mr-4 ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                    : "bg-gradient-to-r from-blue-500 to-blue-600"
                }`}
              >
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className={`text-2xl lg:text-3xl font-bold mb-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Gestion des utilisateurs
                </h1>
                <p
                  className={
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }
                >
                  Administrez et gérez tous les utilisateurs de l'application
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* UserInfo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <div className="">
          <UserInfo />
        </div>
      </motion.div>
    </div>
  );
}

export default Admin;
