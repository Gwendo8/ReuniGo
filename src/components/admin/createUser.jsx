import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaIdBadge,
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
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(156,163,175,0.4)]"
          style={{ transformStyle: "preserve-3d", perspective: 1000 }}
          variants={boxVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg w-[75%] sm:w-[80%] md:max-w-2xl transition-transform transform hover:scale-105 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg md:text-2xl font-medium text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
              <FaUser className="text-blue-600 md:text-xl" />
              Créer un utilisateur
            </h2>

            <form className="space-y-3">
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
              <InputCard
                value={sgid}
                onChange={setSgid}
                label="SGID"
                id="Sgid"
                placeholder="SGID"
                icon={FaIdBadge}
              />

              <InputCard
                value={mail}
                onChange={setMail}
                label="Email"
                id="mail"
                placeholder="Email"
                icon={FaEnvelope}
              />

              <InputCard
                value={password}
                onChange={setPassword}
                label="Mot de passe"
                id="mot de passe"
                placeholder="Mot de passe"
                icon={FaLock}
              />

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

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="bg-gray-400 text-white px-3 md:px-6 py-2 md:py-3 rounded-lg shadow-md hover:bg-gray-500 transition duration-300"
                >
                  Fermer
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCreate(() => {
                      handleClose();
                      closeToggle();
                    });
                  }}
                  className="bg-blue-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                >
                  Enregistrer
                </button>
              </div>
            </form>
            {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CreateUser;
