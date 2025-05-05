import { useState } from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { CheckCircle, ChevronLeft, Eye, EyeOff } from "lucide-react";
import Input from "../components/inputs/input";
import RegisterFetch from "../hook/registerFetch";

function Register() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-blue-100 opacity-60"
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
          className="absolute left-1/4 bottom-1/4 w-96 h-96 rounded-full bg-blue-200 opacity-40"
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
        <div className="hidden md:flex w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#00ADE1]/90 to-[#17428C]/90 text-white p-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute top-8 left-8"
          >
            <a
              href="/"
              className="flex items-center gap-2 text-white hover:text-blue-100 transition-colors"
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
                    <CheckCircle className="h-5 w-5 text-blue-200 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Connexion */}
              <div className="mt-10 w-full">
                <div className="border-t border-white/20 pt-6 text-center">
                  <p className="text-sm text-blue-100">
                    Vous avez déjà un compte ?
                  </p>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    href="/login"
                    className="inline-block mt-2 px-6 py-2 text-white hover:bg-white hover:text-[#17428C] border border-white rounded-xl transition duration-300"
                  >
                    Connectez-vous
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Partie mobile uniquement (image + welcome back) */}
        <div className="md:hidden flex flex-col items-center pt-10 pb-6 bg-gradient-to-r from-[#00ADE1] to-[#17428C] text-white">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-4 left-4"
          >
            <a href="/" className="flex items-center gap-1 text-white text-sm">
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
            className="text-sm text-center px-6 mt-2 text-blue-100"
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
            className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8"
          >
            {/* Indicateur de progression */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-gray-800">
                  {currentStep === 1
                    ? "Informations personnelles"
                    : "Finalisez votre inscription"}
                </h2>
                <span className="text-sm text-gray-500">
                  Étape {currentStep}/{totalSteps}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: "50%" }}
                  animate={{ width: currentStep === 1 ? "50%" : "100%" }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-r from-[#00ADE1] to-[#17428C] h-2 rounded-full"
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
                    className="bg-gray-50 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                  <Input
                    placeholder="Entrez votre prénom..."
                    label="Prénom"
                    value={firstname}
                    onChange={setFirstname}
                    className="bg-gray-50 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                  <Input
                    placeholder="Entrez votre SGID..."
                    label="SGID"
                    value={sgid}
                    onChange={setSgid}
                    className="bg-gray-50 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => isStep1Valid() && setCurrentStep(2)}
                  disabled={!isStep1Valid()}
                  className={`w-full mt-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isStep1Valid()
                      ? "bg-gradient-to-r from-[#00ADE1] to-[#17428C] text-white shadow-md hover:shadow-lg"
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
                    className="bg-gray-50 border-gray-200 focus:border-blue-500 rounded-xl"
                  />

                  <div className="relative">
                    <Input
                      placeholder="Entrez votre mot de passe..."
                      label="Mot de passe"
                      value={password}
                      onChange={setPassword}
                      className="bg-gray-50 border-gray-200 focus:border-blue-500 rounded-xl pr-10"
                    />
                  </div>

                  <div className="relative">
                    <Input
                      placeholder="Confirmer votre mot de passe..."
                      label="Confirmer le mot de passe"
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      className="bg-gray-50 border-gray-200 focus:border-blue-500 rounded-xl pr-10"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-center mt-3 text-sm bg-red-50 p-2 rounded-lg"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(1)}
                    className="w-1/3 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300"
                  >
                    Retour
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRegister}
                    className="w-2/3 py-3 bg-gradient-to-r from-[#00ADE1] to-[#17428C] text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    S'inscrire
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
              <div className="border-t border-gray-200 pt-6 text-center">
                <p className="text-sm text-gray-600">
                  Vous avez déjà un compte ?
                </p>
                <a
                  href="/login"
                  className="inline-block mt-2 px-6 py-2 text-[#17428C] hover:text-white hover:bg-[#17428C] border border-[#17428C] rounded-xl transition duration-300"
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
