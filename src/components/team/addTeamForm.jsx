import React, { useContext, useState } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { FaUsers, FaEdit, FaSave, FaPalette, FaTimes } from "react-icons/fa";
/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import boxVariant from "../animation/boxVariant";
import AddTeamFetch from "../../hook/team/addTeamFetch";
import { ThemeContext } from "../others/themeContext";

function TeamCreationForm({ onSuccess, closePopup }) {
  const [isVisible, setIsVisible] = useState(true);
  const { theme } = useContext(ThemeContext);

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
            className={`rounded-2xl p-0 shadow-2xl w-[90%] max-w-xl mx-auto max-h-[90vh] overflow-hidden ${
              theme === "dark" ? "bg-slate-800" : "bg-white"
            }`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="p-6 relative bg-gradient-to-r from-blue-600 to-blue-400 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                  <FaUsers className="text-white" />
                  Créer une équipe
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
                Créez une nouvelle équipe et ajoutez des membres
              </p>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                <div
                  className={`p-4 rounded-xl ${
                    theme === "dark" ? "bg-slate-700" : "bg-gray-50"
                  }`}
                >
                  <label
                    className={`flex items-center text-lg font-medium mb-2 ${
                      theme === "dark" ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    <FaEdit className="mr-2" style={{ color: colors }} />
                    Nom de l'équipe
                  </label>
                  <TextField
                    placeholder="Ex: Team Developer"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    fullWidth
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor:
                            theme === "dark"
                              ? "rgb(71, 85, 105)"
                              : "rgb(209, 213, 219)",
                        },
                        "&:hover fieldset": {
                          borderColor:
                            theme === "dark"
                              ? "rgb(100, 116, 139)"
                              : "rgb(156, 163, 175)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: colors,
                        },
                        backgroundColor:
                          theme === "dark" ? "rgb(51, 65, 85)" : "white",
                        color:
                          theme === "dark"
                            ? "rgb(229, 231, 235)"
                            : "rgb(31, 41, 55)",
                      },
                      "& .MuiInputLabel-root": {
                        color:
                          theme === "dark"
                            ? "rgb(156, 163, 175)"
                            : "rgb(107, 114, 128)",
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color:
                          theme === "dark"
                            ? "rgb(156, 163, 175)"
                            : "rgb(156, 163, 175)",
                        opacity: 1,
                      },
                    }}
                  />
                </div>

                <div
                  className={`p-4 rounded-xl ${
                    theme === "dark" ? "bg-slate-700" : "bg-gray-50"
                  }`}
                >
                  <label
                    className={`flex items-center text-lg font-medium mb-2 ${
                      theme === "dark" ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
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
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor:
                                theme === "dark"
                                  ? "rgb(71, 85, 105)"
                                  : "rgb(209, 213, 219)",
                            },
                            "&:hover fieldset": {
                              borderColor:
                                theme === "dark"
                                  ? "rgb(100, 116, 139)"
                                  : "rgb(156, 163, 175)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: colors,
                            },
                            backgroundColor:
                              theme === "dark" ? "rgb(51, 65, 85)" : "white",
                            color:
                              theme === "dark"
                                ? "rgb(229, 231, 235)"
                                : "rgb(31, 41, 55)",
                          },
                          "& .MuiInputLabel-root": {
                            color:
                              theme === "dark"
                                ? "rgb(156, 163, 175)"
                                : "rgb(107, 114, 128)",
                          },
                          "& .MuiInputBase-input::placeholder": {
                            color:
                              theme === "dark"
                                ? "rgb(156, 163, 175)"
                                : "rgb(156, 163, 175)",
                            opacity: 1,
                          },
                        }}
                      />
                    )}
                  />
                </div>

                <div
                  className={`p-4 rounded-xl ${
                    theme === "dark" ? "bg-slate-700" : "bg-gray-50"
                  }`}
                >
                  <label
                    className={`flex items-center text-lg font-medium mb-3 ${
                      theme === "dark" ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    <FaPalette className="mr-2" style={{ color: colors }} />
                    Couleur de l'équipe
                  </label>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2">
                      {colorPalette.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full transition-all duration-200 ${
                            colors === color
                              ? `ring-2 ring-offset-2 ${
                                  theme === "dark"
                                    ? "ring-gray-300"
                                    : "ring-gray-400"
                                } scale-110`
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
                        <div
                          className={`w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs ${
                            theme === "dark" ? "bg-slate-600" : "bg-white"
                          }`}
                        >
                          +
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg shadow-inner"
                        style={{ backgroundColor: colors }}
                      />
                      <span
                        className={`font-mono ${
                          theme === "dark" ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
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
                    className={`px-5 py-2.5 rounded-xl border transition duration-300 flex-1 ${
                      theme === "dark"
                        ? "border-slate-600 text-gray-300 hover:bg-slate-700"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
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
