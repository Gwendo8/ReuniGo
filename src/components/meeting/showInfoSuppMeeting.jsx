import { useEffect, useState, useContext } from "react";
/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import jwtDecode from "jwt-decode";
import {
  FaTimesCircle,
  FaUsers,
  FaTimes,
  FaIdCard,
  FaCheck,
  FaFileDownload,
} from "react-icons/fa";
import { useRefresh } from "../others/refreshInfo";
import boxVariant from "../animation/boxVariant";
import SearchBar from "../others/searchBar";
import UserMeetingFetch from "../../hook/meeting/userMeetingFetch";
import { ThemeContext } from "../others/themeContext";

function ShowInfoSuppMeeting({ closePopup, meetingId }) {
  const { theme } = useContext(ThemeContext);
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
            className={`rounded-2xl shadow-2xl w-[95%] max-w-lg max-h-[90vh] overflow-hidden flex flex-col ${
              theme === "dark"
                ? "bg-slate-800 border border-slate-700"
                : "bg-white"
            }`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div
              className={`p-6 text-white ${
                theme === "dark"
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600"
                  : "bg-gradient-to-r from-emerald-600 to-emerald-400"
              }`}
            >
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
                <div
                  className={`mt-2 text-sm flex items-center ${
                    theme === "dark" ? "text-cyan-100" : "text-emerald-50"
                  }`}
                >
                  <span className="bg-white/20 rounded-full px-3 py-1">
                    {presentCount}/{totalCount} présents
                  </span>
                </div>
              )}
            </div>
            {/* Barre de recherche */}
            <div
              className={`px-6 pt-4 pb-2 border-b ${
                theme === "dark" ? "border-gray-600" : "border-gray-200"
              }`}
            >
              <SearchBar
                onSearch={setSearchTerm}
                placeholder="Rechercher un participant..."
              />
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-40">
                  <div
                    className={`w-12 h-12 border-4 border-t-transparent rounded-full animate-spin ${
                      theme === "dark"
                        ? "border-cyan-500"
                        : "border-emerald-500"
                    }`}
                  ></div>
                  <p
                    className={`mt-4 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Chargement des participants...
                  </p>
                </div>
              ) : error ? (
                <div
                  className={`text-center p-6 rounded-lg ${
                    theme === "dark"
                      ? "text-red-400 bg-red-900/20"
                      : "text-red-500 bg-red-50"
                  }`}
                >
                  <p className="font-medium">{error}</p>
                  <p className="mt-2 text-sm">
                    Veuillez réessayer ultérieurement.
                  </p>
                </div>
              ) : filteredParticipants?.length === 0 ? (
                <p
                  className={`text-center py-8 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {searchTerm
                    ? "Aucun participant ne correspond à votre recherche."
                    : "Aucun participant pour cette réunion."}
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  <h2
                    className={`font-bold text-lg mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Participants de la réunion :
                  </h2>
                  <ul className="space-y-3">
                    {filteredParticipants?.map((participant, index) => {
                      const colorClass = getColorFromName(
                        `${participant.firstname}${participant.lastname}`
                      );
                      return (
                        <li
                          key={index}
                          className={`flex flex-col sm:flex-row sm:items-center gap-3 border p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition duration-300 ${
                            theme === "dark"
                              ? "bg-gray-700/50 border-gray-600"
                              : "bg-white border-gray-100"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${colorClass} flex items-center justify-center text-white font-bold text-lg shrink-0`}
                          >
                            {participant.firstname.charAt(0)}
                            {participant.lastname.charAt(0)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <span
                              className={`text-base sm:text-lg font-semibold block truncate ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              {participant.firstname} {participant.lastname}
                            </span>
                            <div
                              className={`flex items-center text-xs sm:text-sm mt-1 ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              <FaIdCard
                                className={`mr-1 shrink-0 ${
                                  theme === "dark"
                                    ? "text-cyan-400"
                                    : "text-emerald-500"
                                }`}
                              />
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
                                  ? theme === "dark"
                                    ? "bg-green-900/30 text-green-300 hover:bg-green-800/30"
                                    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                  : theme === "dark"
                                  ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                              }
                            `}
                              >
                                {participant.present ? (
                                  <>
                                    <FaCheck
                                      className={
                                        theme === "dark"
                                          ? "text-green-400"
                                          : "text-emerald-500"
                                      }
                                    />
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
                        <h2
                          className={`font-bold text-lg mb-2 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Fichiers de la réunion :
                        </h2>
                        <ul className="space-y-2">
                          {files.map((file) => (
                            <li
                              key={file.id}
                              className={`flex items-center justify-between p-2 rounded-lg ${
                                theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                              }`}
                            >
                              <span
                                className={`truncate ${
                                  theme === "dark"
                                    ? "text-gray-300"
                                    : "text-gray-700"
                                }`}
                              >
                                {file.name}
                              </span>
                              <a
                                // encodeURI component permet d'encoder le nom du fichier pour éviter les problèmes de caractères spéciaux
                                // le nom du fichier qui est passé avec le file.name
                                // du coup ici sa envoie une requêtes GET à l'api de la route download-file pour télécharger le fichier
                                href={`https://reunigo.onrender.com/download-file/${encodeURIComponent(
                                  file.name
                                )}`}
                                // permet d'ouvrir le lien dans une nouvelle fenêtre
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 transition-colors ${
                                  theme === "dark"
                                    ? "text-cyan-400 hover:text-cyan-300"
                                    : "text-emerald-600 hover:text-emerald-800"
                                }`}
                              >
                                <FaFileDownload /> Télécharger
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p
                        className={
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }
                      >
                        Aucun fichier associé
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Footer avec bouton de fermeture */}
            <div
              className={`p-4 border-t flex justify-center ${
                theme === "dark"
                  ? "bg-gray-700/50 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <button
                onClick={handleClose}
                className={`px-6 py-2 rounded-lg transition duration-300 flex items-center gap-2 ${
                  theme === "dark"
                    ? "bg-gray-600 hover:bg-gray-500 text-gray-300"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
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
