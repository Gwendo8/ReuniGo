"use client";

import { useState } from "react";
import ShowTeamFetch from "../../hook/showTeamFetch";
/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import boxVariant from "../animation/boxVariant";
import {
  FaUsers,
  FaTimes,
  FaUserFriends,
  FaFilter,
  FaTimesCircle,
} from "react-icons/fa";
import SearchBar from "../others/searchBar";

function ShowTeam({ closePopup }) {
  const [isVisible, setIsVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const { teams, error, loading } = ShowTeamFetch();

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (closePopup) {
        closePopup();
      }
    }, 300);
  };

  // Fonction de recherche
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Filtrer et trier les équipes
  const filteredTeams = teams
    .filter((team) =>
      team.team_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.team_name.localeCompare(b.team_name);
      } else if (sortBy === "members" && a.members && b.members) {
        return b.members.length - a.members.length;
      }
      return 0;
    });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.3)]"
          variants={boxVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FaUsers className="text-white" />
                  Liste des équipes
                </h2>
                <button
                  onClick={handleClose}
                  className="bg-white/20 hover:bg-white/30 transition text-white rounded-full p-2"
                  title="Fermer"
                >
                  <FaTimes />
                </button>
              </div>
              <p className="text-blue-100 mt-1">
                Consultez toutes les équipes disponibles
              </p>
            </div>

            {/* Barre de recherche et filtrage */}
            <div className="bg-gray-50 p-4 border-b">
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="flex-1">
                  <SearchBar
                    onSearch={handleSearch}
                    placeholder="Rechercher une équipe..."
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaFilter className="text-blue-500" />
                  <span>Trier par:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="name">Nom</option>
                    <option value="members">Membres</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {loading && (
                <p className="text-blue-500 text-center mb-4">
                  Chargement des équipes...
                </p>
              )}
              {error && (
                <p className="text-red-500 text-center mb-4">{error}</p>
              )}

              {!loading && !error && filteredTeams.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTeams.map((team) => (
                    <div
                      key={team.team_name}
                      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition duration-300"
                    >
                      <div className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: team.team_colors }}
                          >
                            {team.team_name.charAt(0).toUpperCase()}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {team.team_name}
                          </h3>
                        </div>

                        {team.members && (
                          <div className="mt-3 flex items-center text-gray-500 text-sm">
                            <FaUserFriends className="mr-2" />
                            <span>{team.members.length} membres</span>
                          </div>
                        )}

                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <button
                            className="text-sm hover:underline font-medium flex items-center"
                            style={{ color: team.team_colors }}
                          >
                            Voir les détails →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !loading && (
                  <p className="text-gray-500 text-center">
                    Aucune équipe disponible.
                  </p>
                )
              )}
            </div>
            {/* Footer */}
            <div className="bg-gray-50 p-4 border-t flex justify-center">
              <button
                type="button"
                onClick={handleClose}
                className="bg-gray-400 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-500 transition duration-300 flex items-center gap-2"
              >
                <FaTimesCircle /> Fermer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ShowTeam;
