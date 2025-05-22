import { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import boxVariant from "../animation/boxVariant";
import { FaUsers, FaTimes, FaFilter } from "react-icons/fa";
import SearchBar from "../others/searchBar";
import UpdateInfoTeam from "./updateInfoTeam";
import TeamCard from "./teamCard";
import DeleteTeamFetch from "../../hook/team/deleteTeamFetch";
import ShowInfosTeamFetch from "../../hook/team/showInfosTeamFetch";
import ShowTeamFetch from "../../hook/team/showTeamFetch";

function ShowTeam({ closePopup }) {
  const [isVisible, setIsVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const { teams, loading } = ShowTeamFetch();
  const { deleteTeam } = DeleteTeamFetch();
  const { infoTeam, showInfoTeam } = ShowInfosTeamFetch();
  const [infoTeamVisible, setInfoTeamVisible] = useState(false);
  const [filteredTeams, setFilteredTeams] = useState([]);

  useEffect(() => {
    // La je récupère l'id et le rôle de l'utilisateur connecté
    const currentToken = localStorage.getItem("token");
    if (currentToken) {
      const decodedToken = jwtDecode(currentToken);
      const userRole = decodedToken.rolename;
      const userId = decodedToken.id;
      // Puis je filtre les équipes en fonction du rôle
      const visibleTeams =
        userRole === "ADMIN"
          ? teams
          : teams.filter((team) => team.leader_id === userId);
      setFilteredTeams(visibleTeams);
    }
  }, [teams]);

  const handleDeleteTeam = (id) => {
    if (!id) {
      console.error("ID d'équipe manquant");
      return;
    }

    const confirm = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette équipe ?"
    );
    if (!confirm) return;

    deleteTeam(id, () => {
      console.log("Équipe supprimée et refresh déclenché");
      handleClose();
    });
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (closePopup) {
        closePopup();
      }
    }, 300);
  };

  const handleViewDetails = (team) => {
    showInfoTeam(team.team_id);
    setInfoTeamVisible(true);
  };

  const handleCloseDetails = () => {
    setInfoTeamVisible(false);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Filtrer les équipes en fonction de la recherche et du tri
  const searchedTeams = filteredTeams
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
                Consultez les équipes disponibles
              </p>
            </div>

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
              {loading ? (
                <p className="text-blue-500 text-center mb-4">
                  Chargement des équipes...
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchedTeams.length > 0 ? (
                    searchedTeams.map((team) => (
                      <TeamCard
                        key={team.team_id}
                        team={team}
                        onDelete={handleDeleteTeam}
                        onViewDetails={handleViewDetails}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">
                      Aucune équipe disponible.
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {infoTeamVisible && (
        <UpdateInfoTeam team={infoTeam} closePopup={handleCloseDetails} />
      )}
    </AnimatePresence>
  );
}

export default ShowTeam;
