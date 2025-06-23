import { useContext } from "react";
import UserTopAbsenceFetch from "../../hook/statistic/userTopAbsenceFetch";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { UserX, Loader2, AlertCircle } from "lucide-react";
import { ThemeContext } from "../others/themeContext";

function UserTopAbsence() {
  const { theme } = useContext(ThemeContext);
  const { topAbsence, loading, error } = UserTopAbsenceFetch();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`rounded-xl shadow-md p-6 min-h-[200px] ${
        theme === "dark"
          ? "bg-slate-800/95 border border-slate-700/50"
          : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-cyan-400" : "text-[#2a6b5d]"
          }`}
        >
          Top absences
        </h2>
        <div className="p-1.5 rounded-lg bg-red-100">
          <UserX size={16} className="text-red-500" />
        </div>
      </div>
      {/* Chargement */}
      {loading && (
        <div
          className={`flex items-center justify-center ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <Loader2 className="animate-spin mr-2" size={18} />
          Chargement en cours...
        </div>
      )}
      {/* Erreur */}
      {error && (
        <div
          className={`flex items-center justify-center p-3 rounded-lg ${
            theme === "dark"
              ? "text-red-300 bg-red-900/20"
              : "text-red-600 bg-red-100"
          }`}
        >
          <AlertCircle className="mr-2" size={18} />
          {error}
        </div>
      )}
      {/* Liste */}
      {!loading && !error && (
        <ul className="space-y-2">
          {topAbsence.map((user, idx) => (
            <motion.li
              key={idx}
              variants={itemVariants}
              className={`flex justify-between items-center p-3 rounded-lg transition-colors ${
                theme === "dark"
                  ? "bg-gray-700/50 hover:bg-red-900/20"
                  : "bg-gray-50 hover:bg-red-50"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 font-bold ${
                    theme === "dark"
                      ? "bg-gray-600 text-cyan-400"
                      : "bg-gray-200 text-[#2a6b5d]"
                  }`}
                >
                  {user.name.charAt(0)}
                </div>
                <span
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  {user.name}
                </span>
              </div>
              <span className="text-red-600 font-semibold text-sm">
                {user.nb_absence}
              </span>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

export default UserTopAbsence;
