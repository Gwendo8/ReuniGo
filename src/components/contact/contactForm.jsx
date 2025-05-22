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
import InputCard from "../inputs/inputCard";

function ContactForm() {
  const { form, handleChange, handleSubmit, submitStatus, error } = SendMail();
  return (
    <div>
      {submitStatus === "success" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6"
        >
          Votre message a été envoyé avec succès. Un membre de notre équipe vous
          contactera prochainement.
        </motion.div>
      )}

      {submitStatus === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6"
        >
          Une erreur s'est produite lors de l'envoi du message. Veuillez
          réessayer.
        </motion.div>
      )}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border-l-4 border-red-600 text-red-800 p-4 rounded-lg mb-6"
        >
          {error}
        </motion.div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-gray-700 mb-2 text-sm font-medium">
              <FaUser className="mr-2 text-blue-500" />
              Nom complet
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Votre nom"
            />
          </div>
          <div>
            <label className="flex items-center text-gray-700 mb-2 text-sm font-medium">
              <FaEnvelope className="mr-2 text-blue-500" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="votre@email.com"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center text-gray-700 mb-2 text-sm font-medium">
            <FaTag className="mr-2 text-blue-500" />
            Sujet
          </label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Sujet de votre message"
          />
        </div>

        <div>
          <label className="flex items-center text-gray-700 mb-2 text-sm font-medium">
            <FaComment className="mr-2 text-blue-500" />
            Message
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="Votre message..."
          ></textarea>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className={`px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors flex items-center gap-2 
            }`}
          >
            <>
              <FaPaperPlane /> Envoyer
            </>
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContactForm;
