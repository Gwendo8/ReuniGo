import { Link } from "react-router-dom";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import BoutonCo from "../components/button/bouton-co";
import BoutonInsc from "../components/button/bouton-ins";

function Home() {
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
      <div className="relative z-10 p-4 flex flex-col min-h-screen">
        {/* Navbar visible uniquement en md et + */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex justify-between items-center bg-white/90 backdrop-blur-sm shadow-lg px-10 py-4 rounded-2xl sticky top-4 z-20"
        >
          <div className="flex items-center gap-4">
            <motion.img
              whileHover={{
                rotate: [0, -5, 5, -5, 0],
                transition: { duration: 0.5 },
              }}
              src="/img/logo-saint-gobain.png"
              alt="Logo"
              className="w-16 h-16 object-contain"
            />
            <h1 className="text-2xl font-sans bg-clip-text text-transparent bg-gradient-to-r from-[#00ADE1] to-[#17428C]">
              ReuniGo
            </h1>
          </div>
          <div className="flex gap-6">
            <Link to="/login">
              <BoutonCo value="Connexion" />
            </Link>
            <Link to="/register">
              <BoutonInsc value="Inscription" />
            </Link>
          </div>
        </motion.nav>
        {/* Version Pc (≥ md) */}
        <div className="hidden md:flex flex-1 items-center justify-center py-12">
          <main className="max-w-6xl mx-auto grid grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                  Plateforme de gestion de réunions
                </span>
              </motion.div>

              <h2 className="text-5xl font-extrabold text-gray-800 leading-tight">
                <span className="block">Simplifiez vos</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00ADE1] to-[#17428C]">
                  réunions professionnelles
                </span>
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed">
                ReuniGo simplifie votre quotidien. Validez votre présence à vos
                réunions, gagnez du temps, et organisez votre travail
                efficacement. Tout est centralisé, rapide, et intuitif.
              </p>

              <div className="flex gap-5 mt-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-[#00ADE1] to-[#17428C] text-white px-8 py-4 rounded-xl font-medium shadow-lg transition flex items-center justify-center"
                  >
                    Se connecter
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/register"
                    className="bg-white border-2 border-[#17428C] text-[#17428C] hover:bg-gray-50 px-8 py-4 rounded-xl font-medium shadow-md transition flex items-center justify-center"
                  >
                    S'inscrire
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-3xl transform -translate-x-10 translate-y-10"></div>
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
                className="relative z-10"
              >
                <img
                  src="/img/logo-reunion.png"
                  alt="Réunion"
                  className="w-[450px] h-[450px] object-contain drop-shadow-xl"
                />
              </motion.div>
            </motion.div>
          </main>
        </div>
        {/* Version Mobile (< md) */}
        <div className="md:hidden flex flex-1 flex-col items-center justify-center py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 w-full max-w-md mt-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <img
                src="/img/logo-saint-gobain.png"
                alt="Logo App"
                className="w-28 h-28 object-contain"
              />
            </motion.div>

            <div className="text-center mb-6 space-y-3">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                Plateforme de gestion
              </span>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00ADE1] to-[#17428C]">
                ReuniGo
              </h1>
              <p className="text-base text-gray-600 leading-relaxed">
                Simplifiez votre quotidien avec une seule application. Validez
                votre présence en un clic.
              </p>
            </div>

            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              className="flex justify-center mb-8 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full blur-2xl"></div>
              <img
                src="/img/logo-reunion.png"
                alt="Illustration"
                className="w-48 h-48 object-contain relative z-10"
              />
            </motion.div>

            <div className="flex flex-col gap-4 w-full">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-[#00ADE1] to-[#17428C] h-14 text-white py-4 rounded-xl text-lg font-semibold shadow-md transition-all duration-300 focus:outline-none flex items-center justify-center"
                >
                  Se connecter
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/register"
                  className="bg-white border-2 border-[#17428C] h-14 text-[#17428C] py-4 rounded-xl text-lg font-semibold shadow-sm hover:bg-gray-50 transition-all duration-300 focus:outline-none flex items-center justify-center"
                >
                  S'inscrire
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          <p>&copy; 2025 ReuniGo. Tous droits réservés.</p>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;
