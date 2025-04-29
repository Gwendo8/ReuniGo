import { Plus, Users } from "lucide-react";
import NextMeeting from "../others/nextMeeting";
import FormatDate from "../others/formatDate";
import useToggle from "../others/useToggle";
import FormMeeting from "./formMeeting";
import { useRefresh } from "../others/refreshInfo";
import { useEffect, useState } from "react"; // Importer useState
import TeamCreationForm from "../team/addTeamForm";
import jwtDecode from "jwt-decode";
import ShowTeam from "../team/showTeam";

function MeetingAdd() {
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
  console.log("Rôle de l'utilisateur:", roleUser);

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
    <div className="bg-white rounded-lg shadow-lg p-4 mt-4 flex flex-col w-full text-white">
      {(roleUser === "ADMIN" || roleUser === "MANAGER") && (
        <button
          onClick={handleCreateMeeting}
          className="bg-emerald-700 hover:bg-emerald-800 transition-all duration-300 rounded-md px-4 py-3 flex items-center justify-center gap-2"
        >
          <Plus size={18} className="text-white" />
          <span className="text-sm font-semibold text-white">
            Ajouter une réunion
          </span>
        </button>
      )}
      <div className="mt-2 w-full sm:w-1/2 bg-gray-200 bg-opacity-40 text-gray-800 text-sm font-medium px-4 py-2 rounded-lg text-center">
        Invitation
      </div>

      <hr className="mt-4 border-t border-gray-300" />

      {nextMeeting ? (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h2 className="text-md text-emerald-800 font-normal break-words w-full sm:w-1/2">
              {nextMeeting.meeting_name}
            </h2>
            <p className="text-sm text-black break-words w-full sm:w-1/4">
              🕒 {formatDate(nextMeeting.meeting_date).formattedTime}
            </p>
            <div className="flex justify-end mt-2 sm:mt-0 w-full sm:w-1/4">
              <div className="w-8 h-8 rounded-full bg-amber-300 text-emerald-700 font-semibold flex items-center justify-center">
                {getInitials(nextMeeting.creator_name || "")}
              </div>
            </div>
          </div>

          <div className="text-gray-700 text-sm">
            {formatDate(nextMeeting.meeting_date).dayName},{" "}
            {formatDate(nextMeeting.meeting_date).fullDate}
          </div>
        </div>
      ) : (
        <p className="text-emerald-600 mt-4">Aucune réunion à venir</p>
      )}

      <hr className="mt-4 border-t border-gray-300" />

      {(roleUser === "ADMIN" || roleUser === "MANAGER") && (
        <div className="mt-2 w-full flex flex-col items-center justify-center bg-emerald-50 p-3 rounded-lg text-emerald-700">
          <p className="font-semibold text-sm mb-2 text-center">
            Gérez vos équipes facilement.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button
              onClick={handleOpenShowTeam}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1 px-2 rounded-sm transition duration-300 text-xs"
            >
              <Users size={14} className="text-white" /> Gérer mes équipes
            </button>
            <button
              onClick={handleGoToCreateTeam}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1 px-2 rounded-sm transition duration-300 text-xs"
            >
              <Plus size={14} className="text-white" />
              Créer une équipe
            </button>
          </div>
        </div>
      )}
      {roleUser === "USER" && (
        <div className="mt-4 w-full flex flex-col items-center justify-center bg-blue-50 p-4 rounded-lg text-blue-700">
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
