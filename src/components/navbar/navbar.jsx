import { Link } from "react-router-dom";
import BoutonCo from "../button/bouton-co";
import jwtDecode from "jwt-decode";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { AnimatePresence } from "framer-motion";
import useToggle from "../others/useToggle";
import SlideMenu from "./menu";
import UserAvatar from "./userAvatar";
import { useRefresh } from "../others/refreshInfo";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../others/themeContext";

function Navbar() {
  const [isOpen, toggleOpen] = useToggle(false);
  const { refreshTrigger } = useRefresh();
  const [userData, setUserData] = useState(null);
  const { theme } = useContext(ThemeContext);

  const updateUserData = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserData(decoded);
      } catch (error) {
        console.error("Erreur de décodage du token:", error);
        setUserData(null);
        localStorage.removeItem("token");
      }
    } else {
      setUserData(null);
    }
  };

  useEffect(() => {
    updateUserData();
  }, [refreshTrigger]);

  useEffect(() => {
    const handleStorageChange = () => {
      updateUserData();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const boxVariant = {
    hidden: {
      x: "100%",
      ease: "easeOut",
    },
    visible: {
      x: "0%",
      transition: {
        stiffness: 300,
        damping: 30,
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      x: "100%",
      transition: {
        stiffness: 300,
        damping: 30,
        duration: 0.5,
        ease: "easeIn",
      },
    },
  };

  return (
    <nav
      className={`px-3 sm:px-4 md:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl w-full mx-auto flex justify-between items-center relative ${
        theme === "dark"
          ? "bg-slate-800/95 border border-slate-700/50 shadow-2xl"
          : "bg-white shadow-lg"
      }`}
    >
      {/* Logo et Titre */}
      <div className="flex items-center gap-2 sm:gap-4">
        <img
          src="/img/logo-saint-gobain.png"
          alt="Logo"
          className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain ${
            theme === "dark" ? "filter invert" : ""
          }`}
        />
        <h1
          className={`text-lg sm:text-xl md:text-2xl text-transparent bg-clip-text ${
            theme === "dark"
              ? "bg-gradient-to-r from-cyan-400 to-blue-500"
              : "bg-gradient-to-r from-[#00ADE1] to-[#17428C]"
          }`}
        >
          ReuniGo
        </h1>
      </div>

      {/* Informations de l'utilisateur connecté et bouton du menu */}
      <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
        {userData ? (
          <div className="hidden sm:block">
            <UserAvatar
              firstname={userData.firstname}
              lastname={userData.lastname}
            />
          </div>
        ) : (
          <div className="hidden sm:block">
            <Link to="/login">
              <BoutonCo value="Connexion" />
            </Link>
          </div>
        )}

        {/* Version mobile de l'avatar - juste les initiales */}
        {userData && (
          <div
            className={`sm:hidden flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm ${
              theme === "dark"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                : "bg-gradient-to-r from-[#00ADE1] to-[#17428C]"
            }`}
          >
            {userData.firstname[0]}
            {userData.lastname[0]}
          </div>
        )}

        {/* Bouton de connexion mobile */}
        {!userData && (
          <div className="sm:hidden">
            <Link to="/login">
              <button
                className={`px-3 py-1.5 text-sm rounded-lg font-medium ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                    : "bg-gradient-to-r from-[#00ADE1] to-[#17428C] text-white"
                }`}
              >
                Connexion
              </button>
            </Link>
          </div>
        )}

        <button
          onClick={toggleOpen}
          className={`p-1.5 sm:p-2 rounded-full transition-colors duration-200 focus:outline-none ${
            theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
          }`}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isOpen ? (
            <IoMdClose
              size={24}
              className={`sm:text-[30px] ${
                theme === "dark" ? "text-cyan-400" : "text-[#17428C]"
              }`}
            />
          ) : (
            <GiHamburgerMenu
              size={22}
              className={`z-10 sm:text-[26px] ${
                theme === "dark" ? "text-cyan-400" : "text-[#00ADE1]"
              }`}
            />
          )}
        </button>
      </div>

      {/* Menu coulissant */}
      <AnimatePresence>
        {isOpen && (
          <SlideMenu
            userData={userData}
            toggleOpen={toggleOpen}
            boxVariant={boxVariant}
          />
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
