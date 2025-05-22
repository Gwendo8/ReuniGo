import { useState, useEffect } from "react";
import FormatDate from "../others/formatDate";
import borderColorMeeting from "../others/borderColorMeeting";
import getStatus from "../others/getStatus";
import { useRefresh } from "../others/refreshInfo";
import ShowInfoSuppMeeting from "./showInfoSuppMeeting";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import jwtDecode from "jwt-decode";
import DeleteMeetingFetch from "../../hook/meeting/deleteMeetingFetch";
import MeetingFetch from "../../hook/meeting/meetingFetch";

function ShowMeeting({ selectedSort }) {
  const { refreshTrigger } = useRefresh();
  const { meeting, loading, error, fetchData } = MeetingFetch();
  const { formatDate } = FormatDate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const { deleteMeeting } = DeleteMeetingFetch();
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const roleUser = decodedToken.rolename;
  const userId = decodedToken.id;

  // État pour suivre quelles sections sont développées
  const [expandedSections, setExpandedSections] = useState({
    "À venir": false,
    "En cours": false,
    Passé: false,
  });

  const handleDeleteMeeting = (id) => {
    const confirm = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette réunion ?"
    );
    if (!confirm) return;
    deleteMeeting(id, () => {
      console.log("Réunion supprimé et refresh déclenché");
    });
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger, fetchData]);
  // Grouper les réunions par statut
  const groupedMeetings = {
    "À venir": [],
    "En cours": [],
    Passé: [],
  };

  meeting.forEach((m) => {
    const status = getStatus(m);
    groupedMeetings[status].push(m);
  });

  const statusColors = {
    "À venir": "bg-orange-300",
    "En cours": "bg-green-300",
    Passé: "bg-red-300",
  };
  // Fonction pour modifier le design de la section en fonction de son statut
  const statusWidth = {
    "À venir": "w-full lg:w-1/2",
    "En cours": "w-full lg:w-1/2",
    Passé: "w-full",
  };

  const sectionsToRender =
    selectedSort === "Tous" ? ["À venir", "En cours", "Passé"] : [selectedSort];
  // Fonction pour ouvrir la pop-up de détails d'une réunion
  const openPopup = (meetingId) => {
    setSelectedMeetingId(meetingId);
    setIsPopupOpen(true);
  };
  // Fonction pour fermer la pop-up
  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedMeetingId(null);
  };
  // Fonction pour basculer l'état d'expansion d'une section
  const toggleSection = (status) => {
    setExpandedSections((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };
  return (
    <div className="flex flex-col">
      {loading ? (
        <p className="text-sm text-gray-500">Chargement des réunions...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        sectionsToRender.map((status) =>
          groupedMeetings[status].length > 0 ? (
            <div key={status} className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className={`${statusColors[status]} px-5 py-1 rounded-lg`}>
                  {status}
                </h2>
                {/* Le bouton voir plus ne s'affiche que si il y'a plus de 2 réunions dans la section*/}
                {groupedMeetings[status].length > 2 && (
                  <button
                    className="text-emerald-700 text-sm font-semibold cursor-pointer flex items-center gap-1 hover:underline"
                    onClick={() => toggleSection(status)}
                  >
                    {expandedSections[status] ? (
                      <>
                        Voir moins <ChevronUp size={16} />
                      </>
                    ) : (
                      <>
                        Voir plus <ChevronDown size={16} />
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="flex flex-col">
                {/* La je limite l'affichage à 2 réunions max pour les sections*/}
                {(expandedSections[status]
                  ? groupedMeetings[status]
                  : groupedMeetings[status].slice(0, 2)
                ).map((meet) => (
                  <div
                    key={meet.meeting_name}
                    className={`bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col gap-2 group relative ${
                      statusWidth[status]
                    } ${borderColorMeeting(
                      meet.meeting_date,
                      meet.meeting_time
                    )}`}
                  >
                    {(roleUser === "ADMIN" ||
                      (roleUser === "MANAGER" &&
                        userId === meet.creator_id)) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMeeting(meet.id);
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors top-2 right-2 absolute"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                    <p className="text-lg text-emerald-800 font-medium pr-6">
                      {meet.meeting_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      📍 {meet.meeting_lieu || "Lieu non spécifié"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(meet.meeting_date).dayName},{" "}
                      {formatDate(meet.meeting_date).fullDate}
                    </p>
                    <p className="text-md text-black font-base">
                      🕒 {formatDate(meet.meeting_date).formattedTime}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full">
                        ⏱️
                      </span>
                      <span>
                        Durée :{" "}
                        <span className="font-medium text-gray-800">
                          {meet.meeting_time} min
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-end mt-2">
                      <button
                        className="bg-transparent hover:bg-emerald-600 border border-emerald-700 rounded-md p-2 text-emerald-700
                         hover:text-white font-medium transition duration-300 w-fit"
                        onClick={() => openPopup(meet.id)}
                      >
                        Plus de détails
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {/* La j'affiche un message qui indique combien de réunions sont masqués */}
              {!expandedSections[status] &&
                groupedMeetings[status].length > 2 && (
                  <p className="text-sm text-gray-500 mt-2 text-center italic">
                    {groupedMeetings[status].length - 2}{" "}
                    {groupedMeetings[status].length - 2 > 1
                      ? "réunions supplémentaires"
                      : "réunion supplémentaire"}{" "}
                    masquée{groupedMeetings[status].length - 2 > 1 ? "s" : ""}
                  </p>
                )}
            </div>
          ) : null
        )
      )}
      {/* Pop-up ShowInfoSuppMeeting */}
      {isPopupOpen && selectedMeetingId && (
        <ShowInfoSuppMeeting
          closePopup={closePopup}
          meetingId={selectedMeetingId}
        />
      )}
    </div>
  );
}

export default ShowMeeting;
