import { useEffect, useState, useContext } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaIdBadge,
  FaTimes,
  FaSave,
} from "react-icons/fa";
/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import RoleFetch from "../../hook/roleFetch";
import InputCard from "../inputs/inputCard";
import boxVariant from "../animation/boxVariant";
import UpdateUserFetch from "../../hook/admin/updateUserFetch";
import { ThemeContext } from "../others/themeContext";

function CardInfo({ userSelect, closeToggle }) {
  const { theme } = useContext(ThemeContext);
  const { roleInfo, errorInfo, loading } = RoleFetch();
  const [isVisible, setIsVisible] = useState(false);

  const {
    firstname,
    setFirstname,
    lastname,
    setLastname,
    mail,
    setMail,
    password,
    setPassword,
    idrole,
    setIdRole,
    setId,
    error,
    updateUser,
  } = UpdateUserFetch(() => {
    closeToggle();
    setIsVisible(false);
  });

  useEffect(() => {
    if (userSelect) {
      setFirstname(userSelect.firstname || "");
      setLastname(userSelect.lastname || "");
      setMail(userSelect.mail || "");
      setIdRole(userSelect.rolename || "");
      setPassword("");
      if (userSelect.sgid) {
        setId(userSelect.sgid);
      } else {
        console.error("ID utilisateur manquant");
      }
      setIsVisible(true);
    }
  }, [userSelect]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      closeToggle();
    }, 300);
  };
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm"
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
                  Modifier l'utilisateur
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
                Modifiez les informations de l'utilisateur sélectionné
              </p>
            </div>
            <div className="p-6 overflow-y-auto">
              <form className="grid grid-cols-1 gap-6">
                {/* Informations personnelles */}
                <div
                  className={`p-4 rounded-xl ${
                    theme === "dark"
                      ? "bg-gray-700/50 border border-gray-600"
                      : "bg-gray-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-medium mb-4 pb-2 border-b ${
                      theme === "dark"
                        ? "text-white border-gray-600"
                        : "text-gray-700 border-gray-200"
                    }`}
                  >
                    Informations personnelles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputCard
                      value={firstname}
                      onChange={setFirstname}
                      label="Prénom"
                      id="firstname"
                      placeholder="Prénom"
                      icon={FaUser}
                    />
                    <InputCard
                      value={lastname}
                      onChange={setLastname}
                      label="Nom"
                      id="lastname"
                      placeholder="Nom"
                      icon={FaUser}
                    />
                  </div>
                  <div className="mt-4">
                    <InputCard
                      value={userSelect?.sgid || ""}
                      onChange={() => {}}
                      label="SGID"
                      id="sgid"
                      placeholder="SGID"
                      icon={FaIdBadge}
                      disabled
                    />
                  </div>
                </div>
                {/* Informations de connexion */}
                <div
                  className={`p-4 rounded-xl ${
                    theme === "dark"
                      ? "bg-gray-700/50 border border-gray-600"
                      : "bg-gray-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-medium mb-4 pb-2 border-b ${
                      theme === "dark"
                        ? "text-white border-gray-600"
                        : "text-gray-700 border-gray-200"
                    }`}
                  >
                    Informations de connexion
                  </h3>
                  <div className="space-y-4">
                    <InputCard
                      value={mail}
                      onChange={setMail}
                      label="Email"
                      id="mail"
                      placeholder="exemple@domaine.com"
                      icon={FaEnvelope}
                    />
                    <InputCard
                      value={password}
                      onChange={setPassword}
                      label="Mot de passe"
                      id="password"
                      placeholder="Nouveau mot de passe"
                      icon={FaLock}
                    />
                  </div>
                </div>
                {/* Rôle */}
                <div
                  className={`p-4 rounded-xl ${
                    theme === "dark"
                      ? "bg-gray-700/50 border border-gray-600"
                      : "bg-gray-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-medium mb-4 pb-2 border-b ${
                      theme === "dark"
                        ? "text-white border-gray-600"
                        : "text-gray-700 border-gray-200"
                    }`}
                  >
                    Rôle et permissions
                  </h3>
                  <div className="flex flex-col">
                    <label
                      htmlFor="rolename"
                      className={`text-md md:text-lg mb-2 ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      <FaShieldAlt
                        className={`inline-block mr-2 ${
                          theme === "dark" ? "text-cyan-400" : "text-blue-600"
                        }`}
                      />
                      Rôle
                    </label>
                    {loading ? (
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Chargement des rôles...
                      </p>
                    ) : errorInfo ? (
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-red-400" : "text-red-500"
                        }`}
                      >
                        {errorInfo}
                      </p>
                    ) : (
                      <select
                        id="rolename"
                        name="rolename"
                        value={idrole}
                        onChange={(e) => setIdRole(e.target.value)}
                        className={`p-2 md:p-3 rounded-md border focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "bg-gray-700 text-white border-gray-600 focus:ring-cyan-400"
                            : "bg-gray-50 text-gray-700 border-gray-300 focus:ring-blue-500"
                        }`}
                      >
                        <option value="">-- Sélectionner un rôle --</option>
                        {roleInfo.map((role) => (
                          <option key={role.name} value={role.name}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                {error && (
                  <p
                    className={`text-sm mt-2 ${
                      theme === "dark" ? "text-red-400" : "text-red-500"
                    }`}
                  >
                    {error}
                  </p>
                )}
                {/* Footer */}
                <div className="flex justify-between mt-2 gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className={`px-5 py-2.5 rounded-xl border transition duration-300 flex items-center gap-2 ${
                      theme === "dark"
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <FaTimes /> Annuler
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      updateUser();
                    }}
                    className={`px-5 py-2.5 rounded-xl shadow-lg transition duration-300 flex items-center gap-2 text-white ${
                      theme === "dark"
                        ? "bg-cyan-600 hover:bg-cyan-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    <FaSave /> Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CardInfo;
