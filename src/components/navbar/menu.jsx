// SlideMenu.js
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaChartLine,
  FaEnvelope,
  FaCalendarAlt,
} from "react-icons/fa";
import { LogOut } from "lucide-react";
import { IoMdClose } from "react-icons/io";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import UserAvatar from "./userAvatar";

const SlideMenu = ({ userData, toggleOpen, boxVariant }) => {
  const navigate = useNavigate();
  // cette fonction va permettre de supprimer les informations stocké de l'utilisateur
  const handleLogout = () => {
    // on supprime le token
    localStorage.removeItem("token");
    // ainsi que le role
    localStorage.removeItem("role");
    // et on redirige vers la page de connexion
    navigate("/login");
    // en fermant le menu
    toggleOpen();
  };

  return (
    <motion.div
      variants={boxVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed top-0 right-0 h-full w-[25%] bg-white shadow-xl z-50 flex flex-col p-8 gap-7 rounded-l-4xl"
    >
      {/* Bouton de fermeture */}
      <div className="self-end">
        <button
          onClick={toggleOpen}
          className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-100"
        >
          <IoMdClose size={30} className="text-[#17428C]" />
        </button>
      </div>
      {/* Avatar, nom et prénom */}
      {userData && (
        <UserAvatar
          firstname={userData.firstname}
          lastname={userData.lastname}
          email={userData.email}
        />
      )}
      {/* Liens de navigation */}
      <Link
        to="/"
        onClick={() => toggleOpen()}
        className="flex items-center text-gray-800 hover:text-[#00ADE1] text-lg py-4 gap-4"
      >
        <FaHome size={20} /> Home
      </Link>
      <Link
        to="/meeting"
        onClick={() => toggleOpen()}
        className="flex items-center text-gray-800 hover:text-[#00ADE1] text-lg py-4 gap-4"
      >
        <FaCalendarAlt size={20} /> Réunion
      </Link>
      <Link
        to="/about"
        onClick={() => toggleOpen()}
        className="flex items-center text-gray-800 hover:text-[#00ADE1] text-lg py-4 gap-4"
      >
        <FaUser size={20} /> Utilisateur
      </Link>
      <Link
        to="/services"
        onClick={() => toggleOpen()}
        className="flex items-center text-gray-800 hover:text-[#00ADE1] text-lg py-4 gap-4"
      >
        <FaChartLine size={20} /> Statistique
      </Link>
      <Link
        to="/contact"
        onClick={() => toggleOpen()}
        className="flex items-center text-gray-800 hover:text-[#00ADE1] text-lg py-4 gap-4"
      >
        <FaEnvelope size={20} /> Contact
      </Link>

      {/* Déconnexion */}
      {userData && (
        <Link
          to="/login"
          onClick={() => handleLogout()}
          className="flex items-center text-gray-800 hover:text-red-600 text-lg py-4 gap-4"
        >
          <LogOut size={20} /> Déconnexion
        </Link>
      )}

      {/* Paramètres */}
      <div className="mt-auto">
        <button className="w-full text-gray-800 hover:text-[#00ADE1] text-lg py-2">
          Thème
        </button>
        <button className="w-full text-gray-800 hover:text-[#00ADE1] text-lg py-2">
          Langue
        </button>
      </div>

      {/* Footer */}
      <div className="mt-auto text-center text-sm text-gray-500">
        <p>&copy; 2025 ReuniGo</p>
      </div>
    </motion.div>
  );
};

export default SlideMenu;
