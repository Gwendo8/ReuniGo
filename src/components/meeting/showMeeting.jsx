import MeetingFetch from "../../hook/meetingFetch";
import FormatDate from "../others/formatDate";
import borderColorMeeting from "../others/borderColorMeeting";

function ShowMeeting({ selectedSort }) {
  const { meeting, loading, error } = MeetingFetch();
  const { formatDate } = FormatDate();
  const now = new Date();

  const getStatus = (meeting) => {
    // la je déclare une variable start avec la date de la réunion
    const start = new Date(meeting);
    // ensuite je délcare une variable end qui est la fin de la réunion
    const end = new Date(start);
    // j'ajoute a cette variable 15 minutes en + de la date de la réunion
    end.setMinutes(start.getMinutes() + 15);

    if (start > now) return "À venir";
    if (start <= now && end >= now) return "En cours";
    return "Passé";
  };
  // Grouper les réunions par statut
  // la je créer un objet qui va contenir les réunions
  // en fonction de leur statut
  const groupedMeetings = {
    // je déclare les 3 statuts
    // et je les initialise avec un tableau vide
    "À venir": [],
    "En cours": [],
    Passé: [],
  };
  // la je parcours chaque réunion du tableau meeting
  meeting.forEach((m) => {
    // pour chaque réunion je vais chercher son statut avec la fonction getStatus qui prend en paramètre la date de la réunion
    // cette fonction retourne un statut 'À venir', 'En cours' ou 'Passé'
    const status = getStatus(m.meeting_date);
    // du moment où on connait le status de la réunion on l'ajoute dans le tableau correspondant
    groupedMeetings[status].push(m);
  });
  // La je définis les couleurs de fond pour chaque statut
  const statusColors = {
    "À venir": "bg-orange-300",
    "En cours": "bg-green-300",
    Passé: "bg-red-300",
  };

  // la définis la taille de la carte en fonction du statut
  const statusWidth = {
    "À venir": "w-1/2",
    "En cours": "w-1/2",
    Passé: "w-2/2",
  };
  // La je détermine quel section on affiche
  const sectionsToRender =
    // si l'utilisateur a choisi "Tous" on affiche les 3 sections
    // sinon on affiche seulement la section correspondante au statut choisi
    selectedSort === "Tous" ? ["À venir", "En cours", "Passé"] : [selectedSort];

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
              <div className="flex justify-between mb-2">
                <h2 className={`${statusColors[status]} px-5 py-1 rounded-lg`}>
                  {status}
                </h2>
                <span className="text-emerald-700 text-sm font-semibold">
                  Voir plus
                </span>
              </div>

              {groupedMeetings[status].map((meet) => (
                <div
                  key={meet.meeting_name}
                  className={`bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col gap-2 ${
                    statusWidth[status]
                  } border-l-4 ${borderColorMeeting(meet.meeting_date)}`}
                >
                  <p className="text-lg text-emerald-800 font-medium">
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
                  <div className="flex justify-end">
                    <button
                      className="bg-transparent hover:bg-emerald-600 border border-emerald-700 rounded-md p-2 text-emerald-700
                       hover:text-white font-medium transition duration-300 w-fit"
                    >
                      Plus de détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null
        )
      )}
    </div>
  );
}

export default ShowMeeting;
