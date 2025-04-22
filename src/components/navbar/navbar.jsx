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
import { useEffect, useState } from "react";

function Navbar() {
  const [isOpen, toggleOpen] = useToggle(false);

  // je récupère l'état refreshTrigger du composant useRefresh
  // refresh trigger est le compteur qui s'incrémente à chaque appel de handleCloseCard
  const { refreshTrigger } = useRefresh();

  // je créer un état pour stocker les données de l'utilisateur
  const [userData, setUserData] = useState(null);

  // sa c'est la fonction qui met à jour les données de l'utilisateur à partir du token
  const updateUserData = () => {
    // on récupère le token du localStorage
    const token = localStorage.getItem("token");
    // si le token existe
    if (token) {
      try {
        // on décode le token pour avoir les informations de l'utilisateur
        const decoded = jwtDecode(token);
        // et on met à jour l'état avec les informations décodées
        setUserData(decoded);
      } catch (error) {
        console.error("Erreur de décodage du token:", error);
        // si il y'a une erreur de décodage on réinitialise les données
        setUserData(null);
        // et on supprime le token invalide
        localStorage.removeItem("token");
      }
    } else {
      // si il n'y a pas de token on réinitialise les données
      setUserData(null);
    }
  };

  // ce useEffect se déclenchera à chaque fois que refreshTrigger changera
  useEffect(() => {
    // on appel la fonction qui permet de mettre à jour les données de l'utilisateur
    updateUserData();
  }, [refreshTrigger]);

  // par contre ce useEffect ne s'effectuera qu'une seule fois au montage du composant
  useEffect(() => {
    // cette fonction sera appelé quand le localStorage changera
    const handleStorageChange = () => {
      // qui met à jour les données de l'utilisateur
      updateUserData();
    };

    // j'ajoute un évènement sur le localStorage et j'appelle la fonction handleStorageChange
    window.addEventListener("storage", handleStorageChange);
    // et après je supprime l'évènement (il faut toujours supprimer un évènement)
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
    <nav className="bg-white shadow-lg px-6 py-4 rounded-2xl w-full mx-auto flex justify-between items-center relative">
      {/* Logo et Titre */}
      <div className="flex items-center gap-4">
        <img
          src="/img/logo-saint-gobain.png"
          alt="Logo"
          className="w-14 h-14 object-contain"
        />
        <h1 className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#00ADE1] to-[#17428C]">
          ReuniGo
        </h1>
      </div>
      {/* Informations de l'utilisateur connecté et bouton du menu */}
      <div className="flex items-center gap-6">
        {userData ? (
          <UserAvatar
            firstname={userData.firstname}
            lastname={userData.lastname}
          />
        ) : (
          <Link to="/login">
            <BoutonCo value="Connexion" />
          </Link>
        )}

        <button
          onClick={toggleOpen}
          className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-100 focus:outline-none"
        >
          {isOpen ? (
            <IoMdClose size={30} className="text-[#17428C]" />
          ) : (
            <GiHamburgerMenu size={26} className="text-[#00ADE1] z-10" />
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
