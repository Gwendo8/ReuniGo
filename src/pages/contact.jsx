/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import ContactForm from "../components/contact/contactForm";
import ContactInfo from "../components/contact/contactInfo";
import Navbar from "../components/navbar/navbar";

function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 p-4 font-sans">
      <Navbar />
      <div className="min-h-screen p-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Contact
          </h1>
          <p className="text-gray-600 mt-2">
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
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-5 text-white">
                <h2 className="text-xl font-bold">Formulaire de contact</h2>
                <p className="text-blue-100 text-sm mt-1">
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
