import { useContext } from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import ContactForm from "../components/contact/contactForm";
import ContactInfo from "../components/contact/contactInfo";
import Navbar from "../components/navbar/navbar";
import { ThemeContext } from "../components/others/themeContext";

function Contact() {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`min-h-screen p-4 font-sans ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900"
          : "bg-gradient-to-br from-white via-blue-50 to-blue-100"
      }`}
    >
      <Navbar />
      <div className="min-h-screen p-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1
            className={`text-2xl md:text-3xl font-bold ${
              theme === "dark" ? "text-cyan-400" : "text-gray-800"
            }`}
          >
            Contact
          </h1>
          <p
            className={`mt-2 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Contactez l'équipe support pour toute question ou assistance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div
              className={`rounded-xl shadow-md overflow-hidden ${
                theme === "dark"
                  ? "bg-slate-800/95 border border-slate-700/50"
                  : "bg-white"
              }`}
            >
              <div
                className={`p-5 text-white ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600"
                    : "bg-gradient-to-r from-blue-600 to-blue-400"
                }`}
              >
                <h2 className="text-xl font-bold">Formulaire de contact</h2>
                <p
                  className={`text-sm mt-1 ${
                    theme === "dark" ? "text-cyan-100" : "text-blue-100"
                  }`}
                >
                  Envoyez-nous un message et nous vous répondrons dans les plus
                  brefs délais
                </p>
              </div>
              <div className="p-6">
                <ContactForm />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ContactInfo />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
