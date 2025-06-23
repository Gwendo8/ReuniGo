import { useContext } from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import {
  FaPaperPlane,
  FaUser,
  FaEnvelope,
  FaTag,
  FaComment,
} from "react-icons/fa";
import SendMail from "../../hook/sendMail";
import { ThemeContext } from "../others/themeContext";

function ContactForm() {
  const { theme } = useContext(ThemeContext);
  const { form, handleChange, handleSubmit, submitStatus, error } = SendMail();

  return (
    <div>
      {submitStatus === "success" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border-l-4 p-4 rounded-lg mb-6 ${
            theme === "dark"
              ? "bg-green-900/20 border-green-400 text-green-300"
              : "bg-green-50 border-green-500 text-green-700"
          }`}
        >
          Votre message a été envoyé avec succès. Un membre de notre équipe vous
          contactera prochainement.
        </motion.div>
      )}

      {submitStatus === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border-l-4 p-4 rounded-lg mb-6 ${
            theme === "dark"
              ? "bg-red-900/20 border-red-400 text-red-300"
              : "bg-red-50 border-red-500 text-red-700"
          }`}
        >
          Une erreur s'est produite lors de l'envoi du message. Veuillez
          réessayer.
        </motion.div>
      )}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border-l-4 p-4 rounded-lg mb-6 ${
            theme === "dark"
              ? "bg-red-900/20 border-red-400 text-red-300"
              : "bg-red-100 border-red-600 text-red-800"
          }`}
        >
          {error}
        </motion.div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className={`flex items-center mb-2 text-sm font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <FaUser
                className={`mr-2 ${
                  theme === "dark" ? "text-cyan-400" : "text-blue-500"
                }`}
              />
              Nom complet
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              }`}
              placeholder="Votre nom"
            />
          </div>
          <div>
            <label
              className={`flex items-center mb-2 text-sm font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <FaEnvelope
                className={`mr-2 ${
                  theme === "dark" ? "text-cyan-400" : "text-blue-500"
                }`}
              />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              }`}
              placeholder="votre@email.com"
            />
          </div>
        </div>

        <div>
          <label
            className={`flex items-center mb-2 text-sm font-medium ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <FaTag
              className={`mr-2 ${
                theme === "dark" ? "text-cyan-400" : "text-blue-500"
              }`}
            />
            Sujet
          </label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg transition-colors ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            }`}
            placeholder="Sujet de votre message"
          />
        </div>

        <div>
          <label
            className={`flex items-center mb-2 text-sm font-medium ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <FaComment
              className={`mr-2 ${
                theme === "dark" ? "text-cyan-400" : "text-blue-500"
              }`}
            />
            Message
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows="4"
            className={`w-full px-4 py-2 border rounded-lg transition-colors resize-none ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            }`}
            placeholder="Votre message..."
          ></textarea>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className={`px-5 py-2.5 font-medium rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors flex items-center gap-2 ${
              theme === "dark"
                ? "bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-400"
                : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
            }`}
          >
            <FaPaperPlane /> Envoyer
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContactForm;
