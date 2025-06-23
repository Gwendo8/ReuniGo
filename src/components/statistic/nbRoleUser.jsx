import { useContext } from "react";
import NbRoleUserFetch from "../../hook/statistic/nbRoleUser.fetch";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Shield, Briefcase, User, Loader2, AlertCircle } from "lucide-react";
import { ThemeContext } from "../others/themeContext";

function NbRoleUser() {
  const { theme } = useContext(ThemeContext);
  const { nbRoleUser, loading, error } = NbRoleUserFetch();
  // vu qu'en back je renvoie un tableau d'objet je récupère le premier élément de ce tableau
  const statUser = nbRoleUser[0] || {};
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`rounded-xl shadow-md p-6 ${
        theme === "dark"
          ? "bg-slate-800/95 border border-slate-700/50"
          : "bg-white"
      }`}
    >
      <h2
        className={`text-lg font-semibold mb-4 ${
          theme === "dark" ? "text-cyan-400" : "text-[#2a6b5d]"
        }`}
      >
        Répartition par rôle
      </h2>
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
      {/* Statistiques */}
      {!loading && !error && (
        <div className="space-y-4">
          <div
            className={`flex items-center p-3 rounded-lg ${
              theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
            }`}
          >
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600 mr-3">
              <Shield size={20} />
            </div>
            <div className="flex-1">
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Admins
              </p>
              <div className="flex justify-between items-center">
                <p
                  className={`font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {statUser.admin_count}
                </p>
                <p
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {Math.round(
                    (statUser.admin_count / statUser.total_users) * 100
                  )}
                  %
                </p>
              </div>
            </div>
          </div>

          <div
            className={`flex items-center p-3 rounded-lg ${
              theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
            }`}
          >
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-3">
              <Briefcase size={20} />
            </div>
            <div className="flex-1">
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Managers
              </p>
              <div className="flex justify-between items-center">
                <p
                  className={`font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {statUser.manager_count}
                </p>
                <p
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {Math.round(
                    (statUser.manager_count / statUser.total_users) * 100
                  )}
                  %
                </p>
              </div>
            </div>
          </div>

          <div
            className={`flex items-center p-3 rounded-lg ${
              theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
            }`}
          >
            <div
              className={`p-2 rounded-lg mr-3 ${
                theme === "dark"
                  ? "bg-gray-600 text-gray-300"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <User size={20} />
            </div>
            <div className="flex-1">
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Utilisateurs
              </p>
              <div className="flex justify-between items-center">
                <p
                  className={`font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {statUser.user_count}
                </p>
                <p
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {Math.round(
                    (statUser.user_count / statUser.total_users) * 100
                  )}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default NbRoleUser;
