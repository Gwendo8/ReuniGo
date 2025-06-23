import { useEffect, useState, useContext } from "react";
/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaTimes,
  FaLock,
  FaSave,
  FaUserEdit,
  FaShieldAlt,
} from "react-icons/fa";
import InputCard from "../inputs/inputCard";
import ProfilUserInfoFetch from "../../hook/profilUserInfoFetch";
import UpdateProfilUserFetch from "../../hook/updateProfilUserFetch";
import boxVariant from "../animation/boxVariant";
import LoadingButton from "../others/loadingButton";
import { ThemeContext } from "../others/themeContext";

// le paramètre user contient les informations de l'utilisateur connecté
// et closePopup est une fonction pour fermer la popup
function ProfilUserInfo({ user, closePopup }) {
  const { theme } = useContext(ThemeContext);

  // récupération des informations de l'utilisateur
  const { userInfo, error: fetchError, fetchUserInfo } = ProfilUserInfoFetch();
  // récupération des fonctions et états pour mettre à jour le profil de l'utilisateur
  const {
    updateProfilUser,
    firstname,
    setFirstname,
    lastname,
    setLastname,
    mail,
    setMail,
    password,
    setPassword,
    error: updateError,
    loading,
    //ici je dis que le paramètre user est userInfo qui contient les informations de l'utilisateur
  } = UpdateProfilUserFetch({ user: userInfo });

  // sa c'est l'état pour controller la visibilité de la popup
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (user && user.id) {
      fetchUserInfo(user.id);
    }
  }, [user, fetchUserInfo]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => closePopup(), 400);
  };

  const handleSave = async () => {
    try {
      if (!user?.id) {
        console.error("ID utilisateur manquant");
        return;
      }
      const result = await updateProfilUser(
        user.id,
        firstname,
        lastname,
        mail,
        password
      );
      // On ne ferme la popup que si la mise à jour a réussi
      if (result) {
        handleClose();
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] backdrop-blur-sm"
          variants={boxVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className={`rounded-2xl shadow-2xl w-[90%] max-w-2xl max-h-[90vh] overflow-hidden flex flex-col ${
              theme === "dark"
                ? "bg-slate-800 border border-slate-700"
                : "bg-white"
            }`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Header */}
            <div
              className={`p-6 text-white ${
                theme === "dark"
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600"
                  : "bg-gradient-to-r from-blue-600 to-blue-400"
              }`}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FaUser className="text-white" />
                  Modifier le profil
                </h2>
                <button
                  onClick={handleClose}
                  className="bg-white/20 hover:bg-white/30 transition text-white rounded-full p-2"
                  title="Fermer"
                >
                  <FaTimes />
                </button>
              </div>
              <p
                className={`mt-1 ${
                  theme === "dark" ? "text-cyan-100" : "text-blue-100"
                }`}
              >
                Modifiez vos informations personnelles
              </p>
            </div>
            <div className="p-6 overflow-y-auto">
              <form className="grid grid-cols-1 gap-6">
                {/* Informations personnelles */}
                <div
                  className={`p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-700/30"
                      : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className={`p-2.5 rounded-xl ${
                        theme === "dark" ? "bg-cyan-500/20" : "bg-blue-100"
                      }`}
                    >
                      <FaUserEdit
                        className={`text-lg ${
                          theme === "dark" ? "text-cyan-400" : "text-blue-600"
                        }`}
                      />
                    </div>
                    <h3
                      className={`text-xl font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Informations personnelles
                    </h3>
                  </div>
                  <div className="space-y-5">
                    <InputCard
                      value={firstname}
                      onChange={setFirstname}
                      label="Prénom"
                      placeholder="Votre prénom"
                      icon={FaUser}
                    />
                    <InputCard
                      value={lastname}
                      onChange={setLastname}
                      label="Nom"
                      placeholder="Votre nom"
                      icon={FaUser}
                    />
                    <InputCard
                      value={mail}
                      onChange={setMail}
                      label="Email"
                      placeholder="votre.email@exemple.com"
                      type="email"
                      icon={FaEnvelope}
                    />
                  </div>
                </div>
                {/* Mot de passe */}
                <div
                  className={`p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-red-900/20 to-pink-900/20 border-red-700/30"
                      : "bg-gradient-to-br from-red-50 to-pink-50 border-red-100"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className={`p-2.5 rounded-xl ${
                        theme === "dark" ? "bg-red-500/20" : "bg-red-100"
                      }`}
                    >
                      <FaShieldAlt
                        className={`text-lg ${
                          theme === "dark" ? "text-red-400" : "text-red-600"
                        }`}
                      />
                    </div>
                    <h3
                      className={`text-xl font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Sécurité
                    </h3>
                  </div>
                  <div className="space-y-5">
                    <InputCard
                      value={password}
                      onChange={setPassword}
                      label="Mot de passe"
                      placeholder="Nouveau mot de passe"
                      type="password"
                      icon={FaLock}
                    />
                  </div>
                </div>
                {(fetchError || updateError) && (
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-red-400" : "text-red-500"
                    }`}
                  >
                    {fetchError || updateError}
                  </p>
                )}
                {/* Boutons */}
                <div className="flex justify-between mt-2 gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className={`px-5 py-2.5 rounded-xl border transition duration-300 ${
                      theme === "dark"
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Annuler
                  </button>
                  <LoadingButton
                    onClick={handleSave}
                    loading={loading}
                    loadingText="Enregistrement..."
                    icon={<FaSave />}
                  >
                    Sauvegarder
                  </LoadingButton>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ProfilUserInfo;
