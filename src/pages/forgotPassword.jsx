import { useContext } from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { ChevronLeft, Mail } from "lucide-react";
import Input from "../components/inputs/input";
import ForgotPasswordFetch from "../hook/forgotPasswordFetch";
import { ThemeContext } from "../components/others/themeContext";

export default function ForgotPassword() {
  const { theme } = useContext(ThemeContext);
  const { mail, setMail, handleSubmit, error, submitStatus } =
    ForgotPasswordFetch();

  if (submitStatus === "success" || submitStatus === "error") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-white to-blue-100"
      }`}
    >
      {submitStatus === "success" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border-l-4 p-4 rounded-lg mb-6 w-full max-w-md ${
            theme === "dark"
              ? "bg-green-900/20 border-green-400 text-green-300"
              : "bg-green-50 border-green-500 text-green-700"
          }`}
        >
          ✅ Votre message demande de réinitialisation de mot de passe a été
          envoyé avec succès. Veuillez vérifier votre boîte de réception.
        </motion.div>
      )}

      {submitStatus === "error" && error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border-l-4 p-4 rounded-lg mb-6 w-full max-w-md ${
            theme === "dark"
              ? "bg-red-900/20 border-red-400 text-red-300"
              : "bg-red-50 border-red-500 text-red-700"
          }`}
        >
          ❌ {error}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-md backdrop-blur-sm rounded-2xl shadow-xl p-8 ${
          theme === "dark"
            ? "bg-slate-800/95 border border-slate-700/50"
            : "bg-white/90"
        }`}
      >
        <a
          href="/login"
          className={`flex items-center text-md mb-4 transition-colors ${
            theme === "dark"
              ? "text-cyan-400 hover:text-cyan-300"
              : "text-blue-500 hover:text-blue-700"
          }`}
        >
          <ChevronLeft size={24} className="mr-1" />
          Retour à la connexion
        </a>

        <div className="text-center mb-6">
          <h2
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            Mot de passe oublié ?
          </h2>
          <p
            className={`text-sm mt-2 ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Entrez votre adresse e-mail pour recevoir un mot de passe
            temporaire.
          </p>
        </div>

        <div className="space-y-5">
          <Input
            label="Adresse email"
            placeholder="Entrez votre adresse email..."
            icon={<Mail size={16} />}
            className={`rounded-xl ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 focus:border-cyan-400 text-white"
                : "bg-gray-50 border-gray-200 focus:border-blue-500"
            }`}
            value={mail}
            onChange={setMail}
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 ${
              theme === "dark"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                : "bg-gradient-to-r from-[#00ADE1] to-[#17428C] text-white"
            }`}
            onClick={handleSubmit}
          >
            Envoyer
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
