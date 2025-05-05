"use client";

import { useState, useEffect } from "react";
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import boxVariant from "../animation/boxVariant";
import { FaTimes, FaUsers, FaUser } from "react-icons/fa";
import { Input } from "@mui/material";
import ShowInfosTeamFetch from "../../hook/showInfosTeamFetch";

function UpdateInfoTeam({ team, closePopup }) {
  const [isVisible, setIsVisible] = useState(true);
  const { error, loading, infoTeam, showInfoTeam } = ShowInfosTeamFetch();

  useEffect(() => {
    if (team && team.team_id) {
      showInfoTeam(team.team_id);
    }
  }, [team, showInfoTeam]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (closePopup) {
        closePopup();
      }
    }, 300);
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
            className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FaUsers className="text-white" />
                  Détails de l'équipe
                </h2>
                <button
                  onClick={handleClose}
                  className="bg-white/20 hover:bg-white/30 transition text-white rounded-full p-2"
                  title="Fermer"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6 overflow-y-auto flex-1">
              {loading && (
                <p className="text-center text-gray-500">Chargement...</p>
              )}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              {infoTeam && !loading && !error && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Informations générales
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-gray-700">
                      <p>
                        <span className="font-medium text-gray-700">Nom :</span>{" "}
                        {infoTeam.team_name}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">
                          Couleurs :
                        </span>{" "}
                        {infoTeam.team_colors}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">
                          Leader :
                        </span>{" "}
                        {infoTeam.leader?.firstname} {infoTeam.leader?.lastname}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Membres de l'équipe
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-gray-700">
                      {infoTeam.members?.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                        >
                          <FaUser className="text-gray-500" />
                          <span>
                            {member.firstname} {member.lastname}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-4 border-t flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default UpdateInfoTeam;
