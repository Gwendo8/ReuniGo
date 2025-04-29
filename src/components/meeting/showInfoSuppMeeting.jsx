"use client";

import { useEffect, useState } from "react";
import UserMeetingFetch from "../../hook/userMeetingFetch";
import { useRefresh } from "../others/refreshInfo";
/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import {
  FaTimesCircle,
  FaUsers,
  FaTimes,
  FaUserCircle,
  FaIdCard,
} from "react-icons/fa";
import boxVariant from "../animation/boxVariant";

function ShowInfoSuppMeeting({ closePopup, meetingId }) {
  const { refreshTrigger } = useRefresh();
  const { userMeeting, loading, error, showUserMeeting } =
    UserMeetingFetch(meetingId);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    showUserMeeting(meetingId);
  }, [refreshTrigger, showUserMeeting, meetingId]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      closePopup();
    }, 300);
  };

  // Fonction pour générer une couleur basée sur le nom
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
            className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Header avec dégradé */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 p-6 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
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
              <p className="text-emerald-100 mt-1">
                {userMeeting && userMeeting[0]?.participants?.length
                  ? `${userMeeting[0].participants.length} personnes participent à cette réunion`
                  : "Liste des participants à la réunion"}
              </p>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {loading ? (
                <p className="text-center text-gray-500">Chargement...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : (
                <div className="space-y-4">
                  {userMeeting &&
                  userMeeting.length > 0 &&
                  userMeeting[0].participants ? (
                    <ul className="space-y-3">
                      {userMeeting[0].participants.map((participant, index) => {
                        const colorClass = getColorFromName(
                          `${participant.firstname}${participant.lastname}`
                        );
                        return (
                          <li
                            key={participant.id || index}
                            className="flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition duration-300"
                          >
                            {/* Avatar avec initiales */}
                            <div
                              className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center text-white font-bold text-lg`}
                            >
                              {participant.firstname.charAt(0)}
                              {participant.lastname.charAt(0)}
                            </div>

                            <div className="flex-1">
                              <div className="flex flex-col">
                                <span className="text-lg font-semibold text-gray-800">
                                  {participant.firstname} {participant.lastname}
                                </span>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <FaIdCard className="mr-1 text-emerald-500" />
                                  <span>
                                    {participant.sgid
                                      ? `SGID: ${participant.sgid}`
                                      : "SGID non renseigné"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                      <FaUserCircle className="text-gray-300 text-6xl mb-4" />
                      <p className="text-xl font-medium">
                        Aucun participant trouvé
                      </p>
                      <p className="mt-2 text-gray-400">
                        Cette réunion n'a pas encore de participants
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-4 border-t flex justify-end">
              <button
                onClick={handleClose}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition duration-300"
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
