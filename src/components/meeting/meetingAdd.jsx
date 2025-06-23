import { useContext, useEffect, useState } from "react";
import { Plus, Users } from "lucide-react";
import jwtDecode from "jwt-decode";
import NextMeeting from "../others/nextMeeting";
import FormatDate from "../others/formatDate";
import useToggle from "../others/useToggle";
import FormMeeting from "./formMeeting";
import { useRefresh } from "../others/refreshInfo";
import TeamCreationForm from "../team/addTeamForm";
import ShowTeam from "../team/showTeam";
import { ThemeContext } from "../others/themeContext";

function MeetingAdd() {
  const { theme } = useContext(ThemeContext);
  const { refreshTrigger } = useRefresh();
  const { nextMeeting } = NextMeeting();
  const { formatDate } = FormatDate();
  const { handleCloseCard } = useRefresh();
  const [addMeetingOpen, toggleMeetingOpen] = useToggle(false);

  const [isTeamFormOpen, setIsTeamFormOpen] = useState(false);
  const [showTeamOpen, setShowTeamOpen] = useState(false);

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const roleUser = decodedToken.rolename;

  useEffect(() => {
    // Cette fonction vide est suffisante car NextMeeting() se chargera de rafraîchir les données
  }, [refreshTrigger]);

  const handleCreateMeeting = () => {
    handleCloseCard(); // Si handleCloseCard ferme la modale de réunion, on peut l'appeler ici
    toggleMeetingOpen(); // Ouvre la modale de création de réunion
  };

  const getInitials = (fullName) => {
    // la j'enlève les espaces au début et a la fin du nom prénom et je découpe sa en utilisant l'espace comme séparateur
    const name = fullName.trim().split(" ");
    // si le nom contient le nom et le prénom
    if (name.length >= 2) {
      // alors je prend la première lettre du nom et ensuite je prend la première lettre du prénom
      return name[0][0] + name[1][0];
    }
    // si le nom ne possède qu'un seul mot alors on retourne la première lettre de ce mot
    return fullName[0];
  };

  const handleGoToCreateTeam = () => {
    setIsTeamFormOpen(true);
  };

  const handleCloseTeamForm = () => {
    setIsTeamFormOpen(false);
  };

  const handleOpenShowTeam = () => {
    setShowTeamOpen(true);
  };

  const handleCloseShowTeam = () => {
    setShowTeamOpen(false);
  };

  return (
    <div
      className={`rounded-lg shadow-lg p-4 mt-4 flex flex-col w-full text-white ${
        theme === "dark" ? "bg-slate-800 border border-slate-700" : "bg-white"
      }`}
    >
      {(roleUser === "ADMIN" || roleUser === "MANAGER") && (
        <button
          onClick={handleCreateMeeting}
          className={`transition-all duration-300 rounded-md px-4 py-3 flex items-center justify-center gap-2 ${
            theme === "dark"
              ? "bg-cyan-700 hover:bg-cyan-800 text-white"
              : "bg-emerald-700 hover:bg-emerald-800 text-white"
          }`}
        >
          <Plus size={18} className="text-white" />
          <span className="text-sm font-semibold text-white">
            Ajouter une réunion
          </span>
        </button>
      )}
      <div
        className={`mt-2 w-full sm:w-1/2 text-sm font-medium px-4 py-2 rounded-lg text-center ${
          theme === "dark"
            ? "bg-gray-600 bg-opacity-40 text-gray-300"
            : "bg-gray-200 bg-opacity-40 text-gray-800"
        }`}
      >
        Invitation
      </div>

      <hr
        className={`mt-4 border-t ${
          theme === "dark" ? "border-gray-600" : "border-gray-300"
        }`}
      />

      {nextMeeting ? (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h2
              className={`text-md font-normal break-words w-full sm:w-1/2 ${
                theme === "dark" ? "text-cyan-400" : "text-emerald-800"
              }`}
            >
              {nextMeeting.meeting_name}
            </h2>
            <p
              className={`text-sm break-words w-full sm:w-1/4 ${
                theme === "dark" ? "text-gray-300" : "text-black"
              }`}
            >
              🕒 {formatDate(nextMeeting.meeting_date).formattedTime}
            </p>
            <div className="flex justify-end mt-2 sm:mt-0 w-full sm:w-1/4">
              <div
                className={`w-8 h-8 rounded-full font-semibold flex items-center justify-center ${
                  theme === "dark"
                    ? "bg-cyan-500 text-slate-800"
                    : "bg-amber-300 text-emerald-700"
                }`}
              >
                {getInitials(nextMeeting.creator_name || "")}
              </div>
            </div>
          </div>

          <div
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-700"
            }`}
          >
            {formatDate(nextMeeting.meeting_date).dayName},{" "}
            {formatDate(nextMeeting.meeting_date).fullDate}
          </div>
        </div>
      ) : (
        <p className={theme === "dark" ? "text-cyan-400" : "text-emerald-600"}>
          Aucune réunion à venir
        </p>
      )}

      <hr
        className={`mt-4 border-t ${
          theme === "dark" ? "border-gray-600" : "border-gray-300"
        }`}
      />

      {(roleUser === "ADMIN" || roleUser === "MANAGER") && (
        <div
          className={`mt-2 w-full flex flex-col items-center justify-center p-3 rounded-lg ${
            theme === "dark"
              ? "bg-cyan-900/30 text-cyan-300"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          <p className="font-semibold text-sm mb-2 text-center">
            Gérez vos équipes facilement.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button
              onClick={handleOpenShowTeam}
              className={`flex items-center justify-center gap-2 font-semibold py-1 px-2 rounded-sm transition duration-300 text-xs ${
                theme === "dark"
                  ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              <Users size={14} className="text-white" /> Gérer mes équipes
            </button>
            <button
              onClick={handleGoToCreateTeam}
              className={`flex items-center justify-center gap-2 font-semibold py-1 px-2 rounded-sm transition duration-300 text-xs ${
                theme === "dark"
                  ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              <Plus size={14} className="text-white" />
              Créer une équipe
            </button>
          </div>
        </div>
      )}
      {roleUser === "USER" && (
        <div
          className={`mt-4 w-full flex flex-col items-center justify-center p-4 rounded-lg ${
            theme === "dark"
              ? "bg-blue-900/30 text-blue-300"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          <p className="font-semibold text-sm mb-2 text-center">
            Bienvenue ! Découvrez vos prochaines réunions à venir.
          </p>
        </div>
      )}
      {/* Modale de création de réunion */}
      {addMeetingOpen && (
        <FormMeeting closeToggle={toggleMeetingOpen} onSuccess={() => {}} />
      )}
      {/* Modale de création d'équipe */}
      {isTeamFormOpen && (
        <TeamCreationForm
          closePopup={handleCloseTeamForm}
          onSuccess={handleCloseTeamForm} // <-- Appeler handleCloseTeamForm en cas de succès
        />
      )}
      {showTeamOpen && <ShowTeam closePopup={handleCloseShowTeam} />}
    </div>
  );
}

export default MeetingAdd;
