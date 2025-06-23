import { Link, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import {
  FaHome,
  FaUser,
  FaChartLine,
  FaEnvelope,
  FaCalendarAlt,
  FaUserEdit,
} from "react-icons/fa";
import { LogOut, Moon, Sun, Globe, X, ChevronRight } from "lucide-react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import ProfilUserInfoFetch from "../../hook/profilUserInfoFetch";
import ProfilUserInfo from "./profilUserInfo";
import { ThemeContext } from "../others/themeContext";

const SlideMenu = ({ userData, toggleOpen, boxVariant }) => {
  const navigate = useNavigate();
  const { fetchUserInfo } = ProfilUserInfoFetch();
  const [infoUserVisible, setInfoUserVisible] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleThemeToggle = () => {
    console.log("Bouton thème cliqué");
    toggleTheme();
  };

  const token = localStorage.getItem("token");
  let userRole = null;

  if (token) {
    const decodedToken = jwtDecode(token);
    userRole = decodedToken.rolename;
  }
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
    toggleOpen();
  };
  const handleEditProfile = (user) => {
    fetchUserInfo(user.id);
    setInfoUserVisible(true);
  };
  const handleCloseDetails = () => {
    setInfoUserVisible(false);
  };
  const linkVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1 + i * 0.1,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };
  const allNavLinks = [
    { to: "/", icon: <FaHome size={20} />, label: "Home", requiredRole: null },
    {
      to: "/meeting",
      icon: <FaCalendarAlt size={20} />,
      label: "Réunion",
      requiredRole: null,
    },
    {
      to: "/admin",
      icon: <FaUser size={20} />,
      label: "Utilisateur",
      requiredRole: "ADMIN",
    },
    {
      to: "/stat",
      icon: <FaChartLine size={20} />,
      label: "Statistique",
      requiredRole: "ADMIN",
    },
    {
      to: "/contact",
      icon: <FaEnvelope size={20} />,
      label: "Contact",
      requiredRole: null,
    },
  ];
  const navLinks = allNavLinks.filter(
    (link) => link.requiredRole === null || userRole === link.requiredRole
  );
  return (
    <motion.div
      variants={boxVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`fixed top-0 right-0 h-full w-full sm:w-[320px] md:w-[25%] shadow-xl z-50 flex flex-col p-4 sm:p-6 sm:rounded-l-2xl ${
        theme === "dark"
          ? "bg-slate-800/95 border-l border-slate-700/50"
          : "bg-white"
      }`}
    >
      {/* Bouton de fermeture */}
      <div className="self-end">
        <button
          onClick={toggleOpen}
          className={`p-2 rounded-full transition-all duration-300 ${
            theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
          }`}
          aria-label="Fermer le menu"
        >
          <X
            size={24}
            className={theme === "dark" ? "text-cyan-400" : "text-[#17428C]"}
          />
        </button>
      </div>
      {/* Profil utilisateur */}
      {userData && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-6 sm:mb-8 mt-2"
        >
          <div
            className={`rounded-xl p-4 ${
              theme === "dark"
                ? "bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20"
                : "bg-gradient-to-r from-[#00ADE1]/10 to-[#17428C]/10"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-14 h-14 flex items-center justify-center text-white rounded-full font-bold text-lg uppercase shadow-md ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                    : "bg-gradient-to-r from-[#00ADE1] to-[#17428C]"
                }`}
              >
                {userData.firstname[0]}
                {userData.lastname[0]}
              </div>
              <div className="ml-3 flex-1">
                <span
                  className={`block text-lg font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  {userData.firstname} {userData.lastname}
                </span>
                {userData.email && (
                  <span
                    className={`text-sm truncate block max-w-[200px] ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {userData.email}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleEditProfile(userData)}
                className={`p-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-gray-700 text-cyan-400 hover:bg-gray-600"
                    : "bg-white text-[#00ADE1] hover:bg-gray-50"
                }`}
                aria-label="Modifier le profil"
              >
                <FaUserEdit size={18} />
              </button>
            </div>
            <button
              onClick={() => handleEditProfile(userData)}
              className={`mt-3 w-full flex items-center justify-center py-2 px-4 rounded-lg transition-colors duration-300 text-sm font-medium ${
                theme === "dark"
                  ? "bg-gray-700 border border-cyan-400/20 text-cyan-400 hover:bg-gray-600"
                  : "bg-white border border-[#00ADE1]/20 text-[#00ADE1] hover:bg-[#00ADE1]/5"
              }`}
            >
              <span>Modifier mon profil</span>
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </motion.div>
      )}
      {/* Séparateur */}
      <div
        className={`h-px w-full mb-4 sm:mb-6 ${
          theme === "dark" ? "bg-gray-600" : "bg-gray-200"
        }`}
      />
      {/* Liens de navigation */}
      <nav className="flex flex-col space-y-1 sm:space-y-2">
        {navLinks.map((link, index) => (
          <motion.div
            key={link.to}
            custom={index}
            variants={linkVariants}
            initial="hidden"
            animate="visible"
          >
            <Link
              to={link.to}
              onClick={() => toggleOpen()}
              className={`flex items-center rounded-lg px-4 py-3 transition-all duration-200 font-medium text-base ${
                theme === "dark"
                  ? "text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10"
                  : "text-gray-700 hover:text-[#00ADE1] hover:bg-blue-50"
              }`}
            >
              <span
                className={`mr-3 sm:mr-4 flex items-center justify-center w-6 ${
                  theme === "dark" ? "text-cyan-400" : "text-[#00ADE1]"
                }`}
              >
                {link.icon}
              </span>
              {link.label}
            </Link>
          </motion.div>
        ))}
      </nav>
      {/* Déconnexion */}
      {userData && (
        <motion.div
          variants={linkVariants}
          custom={navLinks.length + 1}
          initial="hidden"
          animate="visible"
          className="mt-3"
        >
          <button
            onClick={handleLogout}
            className={`w-full flex items-center rounded-lg px-4 py-3 transition-all duration-200 font-medium ${
              theme === "dark"
                ? "text-gray-300 hover:text-red-400 hover:bg-red-400/10"
                : "text-gray-700 hover:text-red-500 hover:bg-red-50"
            }`}
          >
            <span className="text-red-500 mr-3 sm:mr-4 flex items-center justify-center w-6">
              <LogOut size={20} />
            </span>
            Déconnexion
          </button>
        </motion.div>
      )}
      {/* Séparateur */}
      <div
        className={`h-px w-full mt-auto mb-4 ${
          theme === "dark" ? "bg-gray-600" : "bg-gray-200"
        }`}
      />
      {/* Thème et langue */}
      <div className="grid grid-cols-2 gap-3 mb-4 sm:mb-6">
        <button
          onClick={handleThemeToggle}
          className={`flex items-center justify-center rounded-lg py-3 px-3 transition-all duration-200 ${
            theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          {theme === "dark" ? (
            <Moon size={16} className="mr-2" />
          ) : (
            <Sun size={16} className="mr-2" />
          )}
          <span className="text-sm font-medium">Thème</span>
        </button>
        <button
          className={`flex items-center justify-center rounded-lg py-3 px-3 transition-all duration-200 ${
            theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          <Globe size={16} className="mr-2" />
          <span className="text-sm font-medium">Langue</span>
        </button>
      </div>
      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mb-2"
      >
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          &copy; 2025{" "}
          <span
            className={`text-transparent bg-clip-text font-medium ${
              theme === "dark"
                ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                : "bg-gradient-to-r from-[#00ADE1] to-[#17428C]"
            }`}
          >
            ReuniGo
          </span>
        </p>
      </motion.div>
      {infoUserVisible && (
        <ProfilUserInfo user={userData} closePopup={handleCloseDetails} />
      )}
    </motion.div>
  );
};

export default SlideMenu;
