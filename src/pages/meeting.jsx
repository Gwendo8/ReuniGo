import { useContext } from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import Meetings from "../components/meeting/meeting";
import Navbar from "../components/navbar/navbar";
import { ThemeContext } from "../components/others/themeContext";

function Meeting() {
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
      <motion.h1
        className={`text-xl lg:text-2xl text-left ml-10 mb-10 mt-12 font-bold ${
          theme === "dark" ? "text-cyan-400" : "text-emerald-600"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        Mon tableau de réunion
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <Meetings />
      </motion.div>
    </div>
  );
}

export default Meeting;
