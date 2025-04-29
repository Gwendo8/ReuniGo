"use client";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaIdBadge,
  FaTimes,
  FaSave,
  FaUserPlus,
} from "react-icons/fa";
/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import RoleFetch from "../../hook/roleFetch";
import CreateUserFetch from "../../hook/createUserFetch";
import InputCard from "../inputs/inputCard";
import { useState } from "react";
import boxVariant from "../animation/boxVariant";

function CreateUser({ closeToggle }) {
  const { roleInfo, errorInfo, loading } = RoleFetch();
  const [isVisible, setIsVisible] = useState(true);

  const {
    firstname,
    setFirstname,
    lastname,
    setLastname,
    sgid,
    setSgid,
    password,
    setPassword,
    mail,
    setMail,
    idrole,
    setIdRole,
    error,
    handleCreate,
  } = CreateUserFetch();

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (closeToggle) closeToggle();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.3)]"
          variants={boxVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Header avec dégradé */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FaUserPlus className="text-white" />
                  Créer un utilisateur
                </h2>
                <button
                  onClick={handleClose}
                  className="bg-white/20 hover:bg-white/30 transition text-white rounded-full p-2"
                  title="Fermer"
                >
                  <FaTimes />
                </button>
              </div>
              <p className="text-blue-100 mt-1">
                Ajoutez un nouvel utilisateur au système
              </p>
            </div>

            <div className="p-6 overflow-y-auto">
              <form className="grid grid-cols-1 gap-6">
                {/* Section Informations personnelles */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-medium text-gray-700 mb-4 border-b pb-2">
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
                      value={sgid}
                      onChange={setSgid}
                      label="SGID"
                      id="Sgid"
                      placeholder="Identifiant unique (SGID)"
                      icon={FaIdBadge}
                    />
                  </div>
                </div>
                {/* Section Informations de connexion */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-medium text-gray-700 mb-4 border-b pb-2">
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
                      id="mot de passe"
                      placeholder="Mot de passe sécurisé"
                      icon={FaLock}
                    />
                  </div>
                </div>
                {/* Section Rôle et permissions */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-medium text-gray-700 mb-4 border-b pb-2">
                    Rôle et permissions
                  </h3>
                  <div className="flex flex-col">
                    <label
                      htmlFor="rolename"
                      className="text-md md:text-lg text-gray-800 mb-2"
                    >
                      <FaShieldAlt className="inline-block mr-2 text-blue-600" />
                      Rôle
                    </label>
                    {loading ? (
                      <p className="text-sm text-gray-500">
                        Chargement des rôles...
                      </p>
                    ) : errorInfo ? (
                      <p className="text-sm text-red-500">{errorInfo}</p>
                    ) : (
                      <select
                        id="rolename"
                        name="rolename"
                        value={idrole}
                        onChange={(e) => setIdRole(e.target.value)}
                        className="p-2 md:p-3 rounded-md bg-gray-50 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">-- Sélectionner un rôle --</option>
                        {roleInfo.map((roleInfo) => (
                          <option key={roleInfo.name} value={roleInfo.name}>
                            {roleInfo.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                {/* Footer */}
                <div className="flex justify-between mt-2 gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition duration-300 flex items-center gap-2"
                  >
                    <FaTimes /> Annuler
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCreate(() => {
                        handleClose();
                      });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition duration-300 flex items-center gap-2"
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

export default CreateUser;
