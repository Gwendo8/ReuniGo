import { useContext } from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { ChevronLeft, LogIn } from "lucide-react";
import LoginFetch from "../hook/loginFetch";
import Input from "../components/inputs/input";
import { ThemeContext } from "../components/others/themeContext";

function Login() {
  const { theme } = useContext(ThemeContext);
  const { sgid, password, error, loading, setSgid, setPassword, handleLogin } =
    LoginFetch();

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-white to-blue-100"
      }`}
    >
      {/* Background elements */}
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
                Bon retour parmi nous !
              </h1>
              <p className="md:text-base lg:text-lg font-light">
                Nous sommes ravis de vous revoir. Connectez-vous pour reprendre
                vos activités et accéder à vos fonctionnalités.
              </p>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-cyan-200" : "text-blue-100"
                }`}
              >
                Si vous avez oublié votre mot de passe, cliquez sur "Mot de
                passe oublié" pour le réinitialiser.
              </p>
              {/* Inscription */}
              <div className="mt-10 w-full">
                <div className="border-t border-white/20 pt-6 text-center">
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-cyan-200" : "text-blue-100"
                    }`}
                  >
                    Vous n'avez pas encore de compte ?
                  </p>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    href="/register"
                    className={`inline-block mt-2 px-6 py-2 border rounded-xl transition duration-300 ${
                      theme === "dark"
                        ? "text-cyan-300 hover:bg-cyan-400/10 hover:text-cyan-200 border-cyan-400"
                        : "text-white hover:bg-white hover:text-[#17428C] border-white"
                    }`}
                  >
                    Inscrivez-vous
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
            Bon retour !
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`text-sm text-center px-6 mt-2 ${
              theme === "dark" ? "text-cyan-200" : "text-blue-100"
            }`}
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
            className={`w-full max-w-md backdrop-blur-sm rounded-2xl shadow-xl p-8 ${
              theme === "dark"
                ? "bg-slate-800/95 border border-slate-700/50"
                : "bg-white/90"
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h2
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                Connexion
              </h2>
              <p
                className={`mt-2 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
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
                className={`rounded-xl ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 focus:border-cyan-400 text-white"
                    : "bg-gray-50 border-gray-200 focus:border-blue-500"
                }`}
              />

              <div className="relative">
                <Input
                  label="Mot de passe"
                  placeholder="Entrez votre mot de passe..."
                  value={password}
                  onChange={setPassword}
                  className={`rounded-xl pr-10 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 focus:border-cyan-400 text-white"
                      : "bg-gray-50 border-gray-200 focus:border-blue-500"
                  }`}
                />
              </div>

              <div className="flex justify-end">
                <a
                  href="/forgot"
                  className={`text-sm transition-colors ${
                    theme === "dark"
                      ? "text-cyan-400 hover:text-cyan-300"
                      : "text-[#00ADE1] hover:text-[#17428C]"
                  }`}
                >
                  Mot de passe oublié ?
                </a>
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

              <motion.button
                whileHover={{ scale: loading ? 1 : 1.03 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                disabled={loading} // ⬅️ Empêche de recliquer 10 fois
                onClick={handleLogin}
                className={`w-full mt-2 py-3 rounded-xl font-medium shadow-md flex items-center justify-center gap-2 transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                    : "bg-gradient-to-r from-[#00ADE1] to-[#17428C] text-white"
                } ${loading && "opacity-70 cursor-not-allowed"}`} // ⬅️ style disabled
              >
                {loading ? (
                  /* Loader */
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Connexion</span>
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Affichage du lien d'inscription en dessous du formulaire seulement en dessous de la taille md */}
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
                  Vous n'avez pas encore de compte ?
                </p>
                <a
                  href="/register"
                  className={`inline-block mt-2 px-6 py-2 border rounded-xl transition duration-300 ${
                    theme === "dark"
                      ? "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 border-cyan-400"
                      : "text-[#17428C] hover:text-white hover:bg-[#17428C] border-[#17428C]"
                  }`}
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
