import { useState, useContext } from "react";
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { FaSave } from "react-icons/fa";
import boxVariant from "../animation/boxVariant";
import ModalHeader from "./modalHeader";
import TeamGeneralInfo from "./teamGeneralInfo";
import TeamMembersList from "./teamMembersList";
import AddTeamMembers from "./addTeamMembers";
import LoadingButton from "../others/loadingButton";
import UpdateTeamFetch from "../../hook/team/updateTeamFetch";
import { ThemeContext } from "../others/themeContext";

function UpdateInfoTeam({ team, closePopup }) {
  const { theme } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddMembers, setShowAddMembers] = useState(false);

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

  const {
    updateTeam,
    leaderId,
    localTeamName,
    setLocalTeamName,
    localColors,
    setLocalColors,
    localMembers,
    setLocalMembers,
    users,
    error,
    loading,
  } = UpdateTeamFetch({ team });

  const handleUpdate = () => {
    if (!team?.team_id) {
      console.error("ID de l'équipe manquant");
      return;
    }
    updateTeam(
      team.team_id,
      localTeamName,
      localColors,
      leaderId,
      localMembers
    );
    handleClose();
  };

  const handleRemoveMember = (memberId) => {
    const updatedMembers = localMembers.filter(
      (member) => member.id !== memberId
    );
    setLocalMembers(updatedMembers);
  };

  const handleAddMember = (user) => {
    const isAlreadyMember = localMembers.some(
      (member) => member.id === user.id
    );

    if (!isAlreadyMember) {
      setLocalMembers([...localMembers, user]);
    }
  };

  const availableUsers = users.filter(
    (user) =>
      !localMembers.some((member) => member.id === user.id) &&
      (user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
            className={`rounded-2xl shadow-2xl w-[90%] max-w-2xl max-h-[90vh] overflow-hidden flex flex-col ${
              theme === "dark" ? "bg-slate-800" : "bg-white"
            }`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <ModalHeader title="Détails de l'équipe" onClose={handleClose} />

            <div className="p-6 overflow-y-auto flex-1">
              {team ? (
                <div className="space-y-6">
                  <TeamGeneralInfo
                    team={team}
                    localTeamName={localTeamName}
                    setLocalTeamName={setLocalTeamName}
                    localColors={localColors}
                    setLocalColors={setLocalColors}
                    colorPalette={colorPalette}
                  />

                  <div>
                    <AddTeamMembers
                      showAddMembers={showAddMembers}
                      setShowAddMembers={setShowAddMembers}
                      availableUsers={availableUsers}
                      onAddMember={handleAddMember}
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                    />

                    <TeamMembersList
                      members={localMembers}
                      teamColor={localColors}
                      onRemoveMember={handleRemoveMember}
                    />
                  </div>
                </div>
              ) : (
                <p
                  className={`text-center ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Aucune information sur cette équipe.
                </p>
              )}
            </div>

            <div
              className={`p-4 border-t flex justify-between items-center ${
                theme === "dark"
                  ? "bg-slate-700 border-slate-600"
                  : "bg-gray-50"
              }`}
            >
              <button
                onClick={handleClose}
                className={`px-5 py-2.5 rounded-xl border transition duration-300 ${
                  theme === "dark"
                    ? "border-slate-600 text-gray-300 hover:bg-slate-600"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Annuler
              </button>

              <LoadingButton
                onClick={handleUpdate}
                loading={loading}
                loadingText="Enregistrement..."
                icon={<FaSave className="w-5 h-5" />}
              >
                Enregistrer
              </LoadingButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default UpdateInfoTeam;
