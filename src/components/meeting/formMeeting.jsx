import { useState, useContext } from "react";
import { Autocomplete } from "@mui/material";
/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import TextField from "@mui/material/TextField";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaEdit,
  FaSave,
  FaTimes,
  FaFileUpload,
} from "react-icons/fa";
import InputCard from "../inputs/inputCard";
import boxVariant from "../animation/boxVariant";
import AddMeetingFetch from "../../hook/meeting/addMeeting";
import { ThemeContext } from "../others/themeContext";

function FormMeeting({ onSuccess }) {
  const { theme } = useContext(ThemeContext);
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
    file,
    setFile,
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
            className={`rounded-2xl shadow-2xl w-[90%] max-w-2xl max-h-[90vh] overflow-hidden flex flex-col ${
              theme === "dark"
                ? "bg-slate-800 border border-slate-700"
                : "bg-white"
            }`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Header */}
            <div
              className={`p-6 text-white ${
                theme === "dark"
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600"
                  : "bg-gradient-to-r from-blue-600 to-blue-400"
              }`}
            >
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
              <p
                className={`mt-1 ${
                  theme === "dark" ? "text-cyan-100" : "text-blue-100"
                }`}
              >
                Planifiez une nouvelle réunion et invitez des participants
              </p>
            </div>

            <div className="p-6 overflow-y-auto">
              <form className="grid grid-cols-1 gap-6">
                {/* Section Informations générales */}
                <div
                  className={`p-4 rounded-xl ${
                    theme === "dark"
                      ? "bg-gray-700/50 border border-gray-600"
                      : "bg-gray-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-medium mb-4 pb-2 border-b ${
                      theme === "dark"
                        ? "text-white border-gray-600"
                        : "text-gray-700 border-gray-200"
                    }`}
                  >
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
                <div
                  className={`p-4 rounded-xl ${
                    theme === "dark"
                      ? "bg-gray-700/50 border border-gray-600"
                      : "bg-gray-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-medium mb-4 pb-2 border-b ${
                      theme === "dark"
                        ? "text-white border-gray-600"
                        : "text-gray-700 border-gray-200"
                    }`}
                  >
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
                <div
                  className={`p-4 rounded-xl ${
                    theme === "dark"
                      ? "bg-gray-700/50 border border-gray-600"
                      : "bg-gray-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-medium mb-4 pb-2 border-b ${
                      theme === "dark"
                        ? "text-white border-gray-600"
                        : "text-gray-700 border-gray-200"
                    }`}
                  >
                    Participants
                  </h3>
                  <div className="flex flex-col">
                    <label
                      className={`text-md md:text-lg mb-2 flex items-center ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      <FaUsers
                        className={`mr-2 ${
                          theme === "dark" ? "text-cyan-400" : "text-blue-600"
                        }`}
                      />
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
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor:
                                theme === "dark" ? "#374151" : "#ffffff",
                              color: theme === "dark" ? "#ffffff" : "#000000",
                              "& fieldset": {
                                borderColor:
                                  theme === "dark" ? "#4B5563" : "#D1D5DB",
                              },
                              "&:hover fieldset": {
                                borderColor:
                                  theme === "dark" ? "#06B6D4" : "#3B82F6",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor:
                                  theme === "dark" ? "#06B6D4" : "#3B82F6",
                              },
                            },
                            "& .MuiInputBase-input::placeholder": {
                              color: theme === "dark" ? "#9CA3AF" : "#6B7280",
                            },
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div
                  className={`p-4 rounded-xl ${
                    theme === "dark"
                      ? "bg-gray-700/50 border border-gray-600"
                      : "bg-gray-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-medium mb-4 pb-2 border-b ${
                      theme === "dark"
                        ? "text-white border-gray-600"
                        : "text-gray-700 border-gray-200"
                    }`}
                  >
                    Fichiers
                  </h3>
                  <label
                    className={`text-md md:text-lg mb-2 flex items-center ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    <FaFileUpload
                      className={`mr-2 ${
                        theme === "dark" ? "text-cyan-400" : "text-blue-600"
                      }`}
                    />
                    Sélectionner des fichiers :
                  </label>
                  <input
                    type="file"
                    multiple
                    className={`block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold transition-colors ${
                      theme === "dark"
                        ? "text-gray-300 file:bg-cyan-900/50 file:text-cyan-300 hover:file:bg-cyan-800/50"
                        : "text-gray-500 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    }`}
                    onChange={(e) => setFile([...e.target.files])}
                  />
                </div>

                {error && (
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-red-400" : "text-red-500"
                    }`}
                  >
                    {error}
                  </p>
                )}

                {/* Footer avec boutons */}
                <div className="flex justify-between mt-2 gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className={`px-5 py-2.5 rounded-xl border transition duration-300 ${
                      theme === "dark"
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Annuler
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
                    className={`px-5 py-2.5 rounded-xl shadow-lg transition duration-300 flex items-center gap-2 text-white ${
                      theme === "dark"
                        ? "bg-cyan-600 hover:bg-cyan-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
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
