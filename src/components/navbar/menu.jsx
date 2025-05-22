import { Link, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import {
  FaHome,
  FaUser,
  FaChartLine,
  FaEnvelope,
  FaCalendarAlt,
} from "react-icons/fa";
import { LogOut, Moon, Globe } from "lucide-react";
import { IoMdClose } from "react-icons/io";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import UserAvatar from "./userAvatar";

const SlideMenu = ({ userData, toggleOpen, boxVariant }) => {
  const navigate = useNavigate();

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
      className="fixed top-0 right-0 h-full w-full sm:w-[300px] md:w-[25%] bg-white shadow-xl z-50 flex flex-col p-4 sm:p-6 sm:rounded-l-2xl"
    >
      {/* Bouton de fermeture */}
      <div className="self-end">
        <button
          onClick={toggleOpen}
          className="p-2 rounded-full transition-all duration-300 hover:bg-gray-100"
        >
          <IoMdClose size={28} className="text-[#17428C]" />
        </button>
      </div>
      {/* Version mobile */}
      {userData && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-6 sm:mb-8 mt-2"
        >
          <div className="block sm:hidden">
            <div className="flex items-center">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-[#00ADE1] to-[#17428C] text-white rounded-full font-bold text-lg uppercase">
                {userData.firstname[0]}
                {userData.lastname[0]}
              </div>
              <div className="ml-3">
                <span className="block text-lg font-medium text-gray-800">
                  {userData.firstname} {userData.lastname}
                </span>
                {userData.email && (
                  <span className="text-sm text-gray-500 truncate block max-w-[200px]">
                    {userData.email}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="hidden sm:block">
            <UserAvatar
              firstname={userData.firstname}
              lastname={userData.lastname}
              email={userData.email}
            />
          </div>
        </motion.div>
      )}
      {/* Séparateur */}
      <div className="h-px w-full bg-gray-200 mb-4 sm:mb-6" />
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
              className="flex items-center text-gray-700 hover:text-[#00ADE1] hover:bg-blue-50 rounded-lg px-4 py-3 sm:py-3 transition-all duration-200 font-medium text-base sm:text-base"
            >
              <span className="text-[#00ADE1] mr-3 sm:mr-4">{link.icon}</span>
              {link.label}
            </Link>
          </motion.div>
        ))}
      </nav>
      {/* Déconnexion */}
      {userData && (
        <motion.div
          variants={linkVariants}
          custom={5}
          initial="hidden"
          animate="visible"
          className="mt-3 sm:mt-4"
        >
          <Link
            to="/login"
            onClick={() => handleLogout()}
            className="flex items-center text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-lg px-4 py-3 transition-all duration-200 font-medium"
          >
            <span className="text-red-500 mr-3 sm:mr-4">
              <LogOut size={20} />
            </span>
            Déconnexion
          </Link>
        </motion.div>
      )}

      {/* Séparateur */}
      <div className="h-px w-full bg-gray-200 mt-auto mb-4" />
      {/* Paramètres - Version mobile (empilés) et desktop (côte à côte) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 sm:mb-6">
        <button className="flex items-center justify-center sm:justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-3 sm:py-2 px-3 transition-all duration-200">
          <Moon size={16} className="mr-2" />
          <span className="text-sm font-medium">Thème</span>
        </button>
        <button className="flex items-center justify-center sm:justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-3 sm:py-2 px-3 transition-all duration-200">
          <Globe size={16} className="mr-2" />
          <span className="text-sm font-medium">Langue</span>
        </button>
      </div>
      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mb-2 sm:mb-0"
      >
        <p className="text-sm text-gray-500">
          &copy; 2025{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ADE1] to-[#17428C] font-medium">
            ReuniGo
          </span>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SlideMenu;
