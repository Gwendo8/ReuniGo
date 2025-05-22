import React, { useState } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { FaUsers, FaEdit, FaSave, FaPalette, FaTimes } from "react-icons/fa";
/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import boxVariant from "../animation/boxVariant";
import AddTeamFetch from "../../hook/team/addTeamFetch";

function TeamCreationForm({ onSuccess, closePopup }) {
  const [isVisible, setIsVisible] = useState(true);

  const {
    teamName,
    setTeamName,
    selectedMembers,
    setSelectedMembers,
    users,
    handleCreateTeam,
    loading,
    error,
    colors,
    setColors,
  } = AddTeamFetch();

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (closePopup) {
        closePopup();
      }
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleCreateTeam(handleClose);
  };

  const colorPalette = [
    "#4F46E5",
    "#0EA5E9",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#6366F1",
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] backdrop-blur-sm"
          variants={boxVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="bg-white rounded-2xl p-0 shadow-2xl w-[90%] max-w-xl mx-auto max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div
              className="p-6 relative"
              style={{
                background: `linear-gradient(135deg, ${colors}33, ${colors}66)`,
                borderBottom: `3px solid ${colors}`,
              }}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FaUsers className="text-gray-800" />
                  Créer une équipe
                </h2>
                <button
                  onClick={handleClose}
                  className="bg-white/30 hover:bg-white/50 transition text-gray-800 rounded-full p-2"
                  title="Fermer"
                >
                  <FaTimes />
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                Créez une nouvelle équipe et ajoutez des membres
              </p>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="flex items-center text-lg font-medium text-gray-700 mb-2">
                    <FaEdit className="mr-2" style={{ color: colors }} />
                    Nom de l'équipe
                  </label>
                  <TextField
                    placeholder="Ex: Team Developer"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                </div>
                {/* Membres */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="flex items-center text-lg font-medium text-gray-700 mb-2">
                    <FaUsers className="mr-2" style={{ color: colors }} />
                    Membres
                  </label>
                  <Autocomplete
                    multiple
                    options={users}
                    getOptionLabel={(option) =>
                      `${option.firstname} ${option.lastname}`
                    }
                    onChange={(event, value) => setSelectedMembers(value)}
                    value={selectedMembers}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Ajouter des membres..."
                      />
                    )}
                  />
                </div>

                {/* Couleur */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="flex items-center text-lg font-medium text-gray-700 mb-3">
                    <FaPalette className="mr-2" style={{ color: colors }} />
                    Couleur de l'équipe
                  </label>

                  <div className="flex flex-col gap-4">
                    {/* Couleur palette */}
                    <div className="flex flex-wrap gap-2">
                      {colorPalette.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full transition-all duration-200 ${
                            colors === color
                              ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                              : "hover:scale-110"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setColors(color)}
                        />
                      ))}

                      <div className="relative">
                        <input
                          type="color"
                          value={colors}
                          onChange={(e) => setColors(e.target.value)}
                          className="opacity-0 absolute inset-0 w-8 h-8 cursor-pointer"
                        />
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs">
                          +
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg shadow-inner"
                        style={{ backgroundColor: colors }}
                      />
                      <span className="text-gray-700 font-mono">
                        {colors.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex justify-between items-center mt-2 gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition duration-300 flex-1"
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl shadow-lg flex-1 flex items-center justify-center gap-2 transition duration-300"
                    style={{
                      backgroundColor: colors,
                      color: "#fff",
                      opacity: loading ? 0.7 : 1,
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      "Création..."
                    ) : (
                      <>
                        <FaSave /> Enregistrer
                      </>
                    )}
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

export default TeamCreationForm;
