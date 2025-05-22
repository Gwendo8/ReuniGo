/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { ChevronLeft, Mail } from "lucide-react";
import Input from "../components/inputs/input";
import ForgotPasswordFetch from "../hook/forgotPasswordFetch";

export default function ForgotPassword() {
  const { mail, setMail, handleSubmit, error, submitStatus } =
    ForgotPasswordFetch();

  if (submitStatus === "success" || submitStatus === "error") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      {submitStatus === "success" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 w-full max-w-md"
        >
          ✅ Votre message demande de réinitialisation de mot de passe a été
          envoyé avec succès. Veuillez vérifier votre boîte de réception.
        </motion.div>
      )}

      {submitStatus === "error" && error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 w-full max-w-md"
        >
          ❌ {error}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8"
      >
        <a
          href="/login"
          className="flex items-center text-md text-blue-500 hover:text-blue-700 mb-4"
        >
          <ChevronLeft size={24} className="mr-1" />
          Retour à la connexion
        </a>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Mot de passe oublié ?
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Entrez votre adresse e-mail pour recevoir un mot de passe
            temporaire.
          </p>
        </div>

        <div className="space-y-5">
          <Input
            label="Adresse email"
            placeholder="Entrez votre adresse email..."
            icon={<Mail size={16} />}
            className="bg-gray-50 border-gray-200 focus:border-blue-500 rounded-xl"
            value={mail}
            onChange={setMail}
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 bg-gradient-to-r from-[#00ADE1] to-[#17428C] text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
            onClick={handleSubmit}
          >
            Envoyer
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
