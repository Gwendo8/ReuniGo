/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { ChevronLeft, Eye, EyeOff, LogIn } from "lucide-react";
import LoginFetch from "../hook/loginFetch";
import Input from "../components/inputs/input";

function Login() {
  const { sgid, password, error, setSgid, setPassword, handleLogin } =
    LoginFetch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Background elements */}
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
                Bon retour parmi nous !
              </h1>
              <p className="md:text-base lg:text-lg font-light">
                Nous sommes ravis de vous revoir. Connectez-vous pour reprendre
                vos activités et accéder à vos fonctionnalités.
              </p>
              <p className="text-sm text-blue-100">
                Si vous avez oublié votre mot de passe, cliquez sur "Mot de
                passe oublié" pour le réinitialiser.
              </p>
              {/* Inscription */}
              <div className="mt-10 w-full">
                <div className="border-t border-white/20 pt-6 text-center">
                  <p className="text-sm text-blue-100">
                    Vous n'avez pas encore de compte ?
                  </p>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    href="/register"
                    className="inline-block mt-2 px-6 py-2 text-white hover:bg-white hover:text-[#17428C] border border-white rounded-xl transition duration-300"
                  >
                    Inscrivez-vous
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
            Bon retour !
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm text-center px-6 mt-2 text-blue-100"
          >
            Connectez-vous pour accéder à votre compte
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
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-800">Connexion</h2>
              <p className="text-gray-500 mt-2">
                Entrez vos identifiants pour vous connecter
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-5"
            >
              <Input
                label="SGID"
                placeholder="Entrez votre SGID..."
                value={sgid}
                onChange={setSgid}
                className="bg-gray-50 border-gray-200 focus:border-blue-500 rounded-xl"
              />

              <div className="relative">
                <Input
                  label="Mot de passe"
                  placeholder="Entrez votre mot de passe..."
                  value={password}
                  onChange={setPassword}
                  className="bg-gray-50 border-gray-200 focus:border-blue-500 rounded-xl pr-10"
                />
              </div>

              <div className="flex justify-end">
                <a
                  href="/forgot"
                  className="text-sm text-[#00ADE1] hover:text-[#17428C] transition-colors"
                >
                  Mot de passe oublié ?
                </a>
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

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogin}
                className="w-full mt-2 py-3 bg-gradient-to-r from-[#00ADE1] to-[#17428C] text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <LogIn size={18} />
                <span>Connexion</span>
              </motion.button>
            </motion.div>

            {/* Affichage du lien d'inscription en dessous du formulaire seulement en dessous de la taille md */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="block md:hidden mt-6 text-center"
            >
              <div className="border-t border-gray-200 pt-6 text-center">
                <p className="text-sm text-gray-600">
                  Vous n'avez pas encore de compte ?
                </p>
                <a
                  href="/register"
                  className="inline-block mt-2 px-6 py-2 text-[#17428C] hover:text-white hover:bg-[#17428C] border border-[#17428C] rounded-xl transition duration-300"
                >
                  Inscrivez-vous
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Login;
