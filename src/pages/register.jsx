import { useState, useContext } from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { CheckCircle, ChevronLeft } from "lucide-react";
import Input from "../components/inputs/input";
import RegisterFetch from "../hook/registerFetch";
import { ThemeContext } from "../components/others/themeContext";

function Register() {
  const { theme } = useContext(ThemeContext);
  const {
    firstname,
    setFirstname,
    lastname,
    setLastname,
    sgid,
    setSgid,
    mail,
    setMail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    loading,
    handleRegister,
  } = RegisterFetch();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  // Fonction pour vérifier si les champs de l'étape 1 sont remplis
  const isStep1Valid = () => {
    return (
      lastname.trim() !== "" && firstname.trim() !== "" && sgid.trim() !== ""
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-white to-blue-100"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={`absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-60 ${
            theme === "dark" ? "bg-cyan-500/20" : "bg-blue-100"
          }`}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.4, 0.6],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className={`absolute left-1/4 bottom-1/4 w-96 h-96 rounded-full opacity-40 ${
            theme === "dark" ? "bg-blue-500/20" : "bg-blue-200"
          }`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 2,
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
        {/* Partie gauche (affiché uniquement à partir de la taille md) */}
        <div
          className={`hidden md:flex w-1/2 flex-col items-center justify-center text-white p-10 relative ${
            theme === "dark"
              ? "bg-gradient-to-br from-slate-800/95 to-gray-800/95"
              : "bg-gradient-to-br from-[#00ADE1]/90 to-[#17428C]/90"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute top-8 left-8"
          >
            <a
              href="/"
              className={`flex items-center gap-2 transition-colors ${
                theme === "dark"
                  ? "text-cyan-300 hover:text-cyan-200"
                  : "text-white hover:text-blue-100"
              }`}
            >
              <ChevronLeft size={20} />
              <span>Retour à l'accueil</span>
            </a>
          </motion.div>

          <div className="max-w-md mx-auto flex flex-col items-center">
            {/* Image avec animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <motion.div
                className="absolute inset-0 bg-white/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              ></motion.div>
              <motion.img
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
                src="/img/heureux.png"
                alt="Developer Cartoon"
                className="md:w-64 lg:w-80 relative z-10"
              />
            </motion.div>

            {/* Texte animé */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center space-y-6 z-10 mt-8"
            >
              <h1 className="md:text-3xl lg:text-4xl font-bold">
                Bienvenue chez ReuniGo !
              </h1>
              <p className="md:text-base lg:text-lg font-light">
                Rejoignez-nous dès aujourd'hui ! Créez votre compte pour accéder
                à toutes nos fonctionnalités et commencer votre expérience avec
                nous.
              </p>

              {/* Liste des avantages */}
              <motion.ul
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-left space-y-3 mt-6"
              >
                {[
                  "Validez votre présence en un clic",
                  "Organisez vos réunions efficacement",
                  "Accédez à vos données depuis n'importe où",
                  "Collaborez avec votre équipe en temps réel",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle
                      className={`h-5 w-5 flex-shrink-0 ${
                        theme === "dark" ? "text-cyan-300" : "text-blue-200"
                      }`}
                    />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Connexion */}
              <div className="mt-10 w-full">
                <div className="border-t border-white/20 pt-6 text-center">
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-cyan-200" : "text-blue-100"
                    }`}
                  >
                    Vous avez déjà un compte ?
                  </p>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    href="/login"
                    className={`inline-block mt-2 px-6 py-2 border rounded-xl transition duration-300 ${
                      theme === "dark"
                        ? "text-cyan-300 hover:bg-cyan-400/10 hover:text-cyan-200 border-cyan-400"
                        : "text-white hover:bg-white hover:text-[#17428C] border-white"
                    }`}
                  >
                    Connectez-vous
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Partie mobile uniquement (image + welcome back) */}
        <div
          className={`md:hidden flex flex-col items-center pt-10 pb-6 text-white ${
            theme === "dark"
              ? "bg-gradient-to-r from-slate-800 to-gray-800"
              : "bg-gradient-to-r from-[#00ADE1] to-[#17428C]"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-4 left-4"
          >
            <a
              href="/"
              className={`flex items-center gap-1 transition-colors text-sm ${
                theme === "dark"
                  ? "text-cyan-300 hover:text-cyan-200"
                  : "text-white hover:text-blue-100"
              }`}
            >
              <ChevronLeft size={16} />
              <span>Retour</span>
            </a>
          </motion.div>

          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src="/img/heureux.png"
            alt="Developer Cartoon"
            className="w-48 mb-4"
          />
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl font-bold"
          >
            Bienvenue !
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`text-sm text-center px-6 mt-2 ${
              theme === "dark" ? "text-cyan-200" : "text-blue-100"
            }`}
          >
            Créez votre compte pour accéder à toutes nos fonctionnalités
          </motion.p>
        </div>

        {/* Partie formulaire */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center py-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`w-full max-w-md backdrop-blur-sm rounded-2xl shadow-xl p-8 ${
              theme === "dark"
                ? "bg-slate-800/95 border border-slate-700/50"
                : "bg-white/90"
            }`}
          >
            {/* Indicateur de progression */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2
                  className={`text-xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  {currentStep === 1
                    ? "Informations personnelles"
                    : "Finalisez votre inscription"}
                </h2>
                <span
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Étape {currentStep}/{totalSteps}
                </span>
              </div>
              <div
                className={`w-full rounded-full h-2 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <motion.div
                  initial={{ width: "50%" }}
                  animate={{ width: currentStep === 1 ? "50%" : "100%" }}
                  transition={{ duration: 0.3 }}
                  className={`h-2 rounded-full ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                      : "bg-gradient-to-r from-[#00ADE1] to-[#17428C]"
                  }`}
                ></motion.div>
              </div>
            </div>

            {currentStep === 1 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <Input
                    placeholder="Entrez votre nom..."
                    label="Nom"
                    value={lastname}
                    onChange={setLastname}
                    className={`rounded-xl ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 focus:border-cyan-400 text-white"
                        : "bg-gray-50 border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  <Input
                    placeholder="Entrez votre prénom..."
                    label="Prénom"
                    value={firstname}
                    onChange={setFirstname}
                    className={`rounded-xl ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 focus:border-cyan-400 text-white"
                        : "bg-gray-50 border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  <Input
                    placeholder="Entrez votre SGID..."
                    label="SGID"
                    value={sgid}
                    onChange={setSgid}
                    className={`rounded-xl ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 focus:border-cyan-400 text-white"
                        : "bg-gray-50 border-gray-200 focus:border-blue-500"
                    }`}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => isStep1Valid() && setCurrentStep(2)}
                  disabled={!isStep1Valid()}
                  className={`w-full mt-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isStep1Valid()
                      ? theme === "dark"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:shadow-lg"
                        : "bg-gradient-to-r from-[#00ADE1] to-[#17428C] text-white shadow-md hover:shadow-lg"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Continuer
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <Input
                    placeholder="Entrez votre email..."
                    label="Email"
                    type="email"
                    value={mail}
                    onChange={setMail}
                    className={`rounded-xl ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 focus:border-cyan-400 text-white"
                        : "bg-gray-50 border-gray-200 focus:border-blue-500"
                    }`}
                  />

                  <div className="relative">
                    <Input
                      placeholder="Entrez votre mot de passe..."
                      label="Mot de passe"
                      value={password}
                      onChange={setPassword}
                      className={`rounded-xl pr-10 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 focus:border-cyan-400 text-white"
                          : "bg-gray-50 border-gray-200 focus:border-blue-500"
                      }`}
                    />
                  </div>

                  <div className="relative">
                    <Input
                      placeholder="Confirmer votre mot de passe..."
                      label="Confirmer le mot de passe"
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      className={`rounded-xl pr-10 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 focus:border-cyan-400 text-white"
                          : "bg-gray-50 border-gray-200 focus:border-blue-500"
                      }`}
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-center mt-3 text-sm p-2 rounded-lg ${
                      theme === "dark"
                        ? "text-red-300 bg-red-900/20"
                        : "text-red-500 bg-red-50"
                    }`}
                  >
                    {error}
                  </motion.div>
                )}

                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(1)}
                    className={`w-1/3 py-3 rounded-xl font-medium transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    Retour
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: loading ? 1 : 1.03 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    disabled={loading}
                    onClick={handleRegister}
                    className={`w-2/3 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                        : "bg-gradient-to-r from-[#00ADE1] to-[#17428C] text-white"
                    } ${loading && "opacity-70 cursor-not-allowed"}`}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span>S'inscrire</span>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
            {/* Affichage du lien de connexion en dessous du formulaire seulement en dessous de la taille md */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="block md:hidden mt-6 text-center"
            >
              <div
                className={`pt-6 text-center ${
                  theme === "dark"
                    ? "border-t border-gray-600"
                    : "border-t border-gray-200"
                }`}
              >
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Vous avez déjà un compte ?
                </p>
                <a
                  href="/login"
                  className={`inline-block mt-2 px-6 py-2 border rounded-xl transition duration-300 ${
                    theme === "dark"
                      ? "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 border-cyan-400"
                      : "text-[#17428C] hover:text-white hover:bg-[#17428C] border-[#17428C]"
                  }`}
                >
                  Connectez-vous
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Register;
