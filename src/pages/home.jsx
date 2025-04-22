import { Link } from "react-router-dom";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import BoutonCo from "../components/button/bouton-co";
import BoutonInsc from "../components/button/bouton-ins";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 flex flex-col">
      {/* Navbar visible uniquement en md et + */}
      <nav className="hidden md:flex justify-between items-center bg-white shadow-md px-10 py-4 rounded-2xl">
        <div className="flex items-center gap-4">
          <img
            src="/img/logo-saint-gobain.png"
            alt="Logo"
            className="w-16 h-16 object-contain"
          />
          <h1 className="text-2xl font-sans bg-clip-text text-transparent bg-gradient-to-r from-[#00ADE1]    to-[#17428C]">
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
      </nav>

      {/* Version Desktop (≥ md) */}
      <div className="hidden md:flex flex-1 items-center justify-center">
        <main className="max-w-6xl mx-auto grid grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5 }}
            className="space-y-6"
          >
            <h2 className="text-5xl font-extrabold text-gray-800">
              Bienvenue sur ReuniGo
            </h2>
            <p className="text-lg text-gray-600">
              ReuniGo simplifie votre quotidien. Validez votre présence à vos
              réunions, gagnez du temps, et organisez votre travail
              efficacement. Tout est centralisé, rapide, et intuitif.
            </p>
            <div className="flex gap-4 mt-6">
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition"
              >
                Se connecter
              </Link>
              <Link
                to="/login"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition"
              >
                S'inscrire
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <img
              src="/img/logo-reunion.png"
              alt="Réunion"
              className="w-[400px] h-[400px] object-contain drop-shadow-lg"
            />
          </motion.div>
        </main>
      </div>

      {/* Version Mobile (< md) */}
      <div className="md:hidden flex flex-1 flex-col items-center justify-center">
        <div className="flex flex-col items-center bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mt-8">
          <div className="flex justify-center mb-6">
            <img
              src="/img/logo-saint-gobain.png"
              alt="Logo App"
              className="w-36 h-36 object-contain"
            />
          </div>

          <div className="text-center mb-5 space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">
              Bienvenue sur ReuniGo
            </h1>
            <p className="text-lg text-gray-600">
              Simplifiez votre quotidien avec une seule application. <br />
              Validez votre présence en un clic.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <img
              src="/img/logo-reunion.png"
              alt="Illustration"
              className="w-52 h-52 object-contain"
            />
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Link
              to="/login"
              className="bg-blue-600 h-14 text-white py-4 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 transition-all duration-300 focus:outline-none flex items-center justify-center"
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              className="bg-green-600 h-14 text-white py-4 rounded-lg text-lg font-semibold shadow-md hover:bg-green-700 transition-all duration-300 focus:outline-none flex items-center justify-center"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>&copy; 2025 ReuniGo. Tous droits réservés.</p>
      </div>
    </div>
  );
}

export default Home;
