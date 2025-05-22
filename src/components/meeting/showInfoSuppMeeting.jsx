import { useEffect, useState } from "react";
import { useRefresh } from "../others/refreshInfo";
/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import {
  FaTimesCircle,
  FaUsers,
  FaTimes,
  FaIdCard,
  FaCheck,
  FaFileDownload,
} from "react-icons/fa";
import boxVariant from "../animation/boxVariant";
import SearchBar from "../others/searchBar";
import jwtDecode from "jwt-decode";
import UserMeetingFetch from "../../hook/meeting/userMeetingFetch";

function ShowInfoSuppMeeting({ closePopup, meetingId }) {
  const { refreshTrigger } = useRefresh();
  const {
    userMeeting,
    files,
    loading,
    error,
    showUserMeeting,
    updateUserPresence,
  } = UserMeetingFetch(meetingId);
  const [isVisible, setIsVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const roleUser = decodedToken.rolename;
  const userId = decodedToken.id;
  // donc la je dis si userMeeting existe et qu'il contient au moins un élément
  // userMeeting qui est un tableau d'objets des réunions et des participants de la réunion
  // alors on essaie d'accéder à la propriété creatorId du premier élément
  const meetingCreatorId = userMeeting?.[0]?.creatorId;

  useEffect(() => {
    showUserMeeting(meetingId);
  }, [refreshTrigger, showUserMeeting, meetingId]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      closePopup();
    }, 300);
  };
  const getColorFromName = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-emerald-500",
      "bg-purple-500",
      "bg-amber-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-rose-500",
      "bg-cyan-500",
    ];
    const sum = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[sum % colors.length];
  };
  // Filtrer les participants en fonction de la recherche
  const filteredParticipants = userMeeting?.[0]?.participants?.filter(
    (participant) =>
      `${participant.firstname} ${participant.lastname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (participant.sgid &&
        participant.sgid.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  // Fonction qui compte le nombre de personne présente
  const presentCount =
    userMeeting?.[0]?.participants?.filter((p) => p.present).length || 0;
  const totalCount = userMeeting?.[0]?.participants?.length || 0;

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
            className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 p-6 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <FaUsers className="text-white" />
                  Participants
                </h2>
                <button
                  onClick={handleClose}
                  className="bg-white/20 hover:bg-white/30 transition text-white rounded-full p-2"
                  title="Fermer"
                >
                  <FaTimes />
                </button>
              </div>
              {!loading && !error && (
                <div className="mt-2 text-emerald-50 text-sm flex items-center">
                  <span className="bg-white/20 rounded-full px-3 py-1">
                    {presentCount}/{totalCount} présents
                  </span>
                </div>
              )}
            </div>
            {/* Barre de recherche */}
            <div className="px-6 pt-4 pb-2 border-b">
              <SearchBar
                onSearch={setSearchTerm}
                placeholder="Rechercher un participant..."
              />
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-40">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-500">
                    Chargement des participants...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 p-6 bg-red-50 rounded-lg">
                  <p className="font-medium">{error}</p>
                  <p className="mt-2 text-sm">
                    Veuillez réessayer ultérieurement.
                  </p>
                </div>
              ) : filteredParticipants?.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  {searchTerm
                    ? "Aucun participant ne correspond à votre recherche."
                    : "Aucun participant pour cette réunion."}
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  <h2 className="font-bold text-lg mb-2">
                    Participants de la réunion :
                  </h2>
                  <ul className="space-y-3">
                    {filteredParticipants?.map((participant, index) => {
                      const colorClass = getColorFromName(
                        `${participant.firstname}${participant.lastname}`
                      );
                      return (
                        <li className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white border border-gray-100 p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition duration-300">
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${colorClass} flex items-center justify-center text-white font-bold text-lg shrink-0`}
                          >
                            {participant.firstname.charAt(0)}
                            {participant.lastname.charAt(0)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="text-base sm:text-lg font-semibold text-gray-800 block truncate">
                              {participant.firstname} {participant.lastname}
                            </span>
                            <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1">
                              <FaIdCard className="mr-1 text-emerald-500 shrink-0" />
                              <span className="truncate">
                                {participant.sgid
                                  ? `SGID: ${participant.sgid}`
                                  : "SGID non renseigné"}
                              </span>
                            </div>
                          </div>
                          {(roleUser === "ADMIN" ||
                            (roleUser === "MANAGER" &&
                              userId === meetingCreatorId)) && (
                            <div className="flex items-center justify-end mt-2 sm:mt-0">
                              <button
                                onClick={() =>
                                  updateUserPresence(
                                    participant.id,
                                    !participant.present
                                  )
                                }
                                className={`
                              flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300
                              ${
                                participant.present
                                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                              }
                            `}
                              >
                                {participant.present ? (
                                  <>
                                    <FaCheck className="text-emerald-500" />
                                    <span>Présent</span>
                                  </>
                                ) : (
                                  <>
                                    <FaTimes className="text-gray-400" />
                                    <span>Absent</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  <div className="p-4 overflow-y-auto flex-1">
                    {files.length > 0 ? (
                      <div className="mt-4">
                        <h2 className="font-bold text-lg mb-2">
                          Fichiers de la réunion :
                        </h2>
                        <ul className="space-y-2">
                          {files.map((file) => (
                            <li
                              key={file.id}
                              className="flex items-center justify-between bg-gray-100 p-2 rounded-lg"
                            >
                              <span className="truncate">{file.name}</span>
                              <a
                                // encodeURI component permet d'encoder le nom du fichier pour éviter les problèmes de caractères spéciaux
                                // le nom du fichier qui est passé avec le file.name
                                // du coup ici sa envoie une requêtes GET à l'api de la route download-file pour télécharger le fichier
                                href={`http://localhost:8000/download-file/${encodeURIComponent(
                                  file.name
                                )}`}
                                // permet d'ouvrir le lien dans une nouvelle fenêtre
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-600 hover:text-emerald-800 flex items-center gap-2"
                              >
                                <FaFileDownload /> Télécharger
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-gray-500">Aucun fichier associé</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Footer avec bouton de fermeture */}
            <div className="bg-gray-50 p-4 border-t flex justify-center">
              <button
                onClick={handleClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition duration-300 flex items-center gap-2"
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

export default ShowInfoSuppMeeting;
