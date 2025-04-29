"use client";

import { useState } from "react";
import AddMeetingFetch from "../../hook/addMeeting";
import InputCard from "../inputs/inputCard";
import { Autocomplete } from "@mui/material";
/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import boxVariant from "../animation/boxVariant";
import TextField from "@mui/material/TextField";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaEdit,
  FaSave,
  FaTimesCircle,
  FaTimes,
} from "react-icons/fa";

function FormMeeting({ onSuccess }) {
  const [isVisible, setIsVisible] = useState(true);
  const {
    meeting_name,
    setMeetingName,
    meeting_date,
    setMeetingDate,
    meeting_time,
    setMeetingTime,
    meeting_lieu,
    setMeetingLieu,
    selectedParticipantsAndTeams,
    setSelectedParticipantsAndTeams,
    combinedOptions,
    handleCreateMeeting,
    error,
  } = AddMeetingFetch();

  const handleClose = () => setIsVisible(false);

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
            {/* Header avec dégradé */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FaCalendarAlt className="text-white" />
                  Créer une réunion
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
                Planifiez une nouvelle réunion et invitez des participants
              </p>
            </div>

            <div className="p-6 overflow-y-auto">
              <form className="grid grid-cols-1 gap-6">
                {/* Section Informations générales */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-medium text-gray-700 mb-4 border-b pb-2">
                    Informations générales
                  </h3>
                  <div className="space-y-4">
                    <InputCard
                      value={meeting_name}
                      onChange={setMeetingName}
                      label="Nom de la réunion"
                      placeholder="Ex: Réunion hebdomadaire d'équipe"
                      icon={FaEdit}
                    />
                    <InputCard
                      value={meeting_lieu}
                      onChange={setMeetingLieu}
                      label="Lieu"
                      placeholder="Ex: Salle de conférence A ou Lien Zoom"
                      icon={FaMapMarkerAlt}
                    />
                  </div>
                </div>

                {/* Section Date et durée */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-medium text-gray-700 mb-4 border-b pb-2">
                    Date et durée
                  </h3>
                  <div className="space-y-4">
                    <InputCard
                      value={meeting_date}
                      onChange={setMeetingDate}
                      label="Date et heure de début"
                      placeholder="Sélectionnez date et heure"
                      type="datetime-local"
                      icon={FaCalendarAlt}
                    />
                    <InputCard
                      value={meeting_time}
                      onChange={setMeetingTime}
                      label="Durée (minutes)"
                      placeholder="Ex: 60"
                      type="number"
                      icon={FaClock}
                    />
                  </div>
                </div>

                {/* Section Participants */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-medium text-gray-700 mb-4 border-b pb-2">
                    Participants
                  </h3>
                  <div className="flex flex-col">
                    <label className="text-md md:text-lg text-gray-800 mb-2 flex items-center">
                      <FaUsers className="mr-2 text-blue-600" />
                      Participants et Équipes
                    </label>
                    <Autocomplete
                      multiple
                      options={combinedOptions}
                      getOptionLabel={(option) => option.label}
                      onChange={(event, value) =>
                        setSelectedParticipantsAndTeams(value)
                      }
                      value={selectedParticipantsAndTeams}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Ajouter des membres..."
                          variant="outlined"
                        />
                      )}
                    />
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Footer avec boutons */}
                <div className="flex justify-between mt-2 gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition duration-300 flex items-center gap-2"
                  >
                    <FaTimesCircle /> Annuler
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCreateMeeting(() => {
                        handleClose();
                        onSuccess();
                      });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition duration-300 flex items-center gap-2"
                  >
                    <FaSave /> Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FormMeeting;
