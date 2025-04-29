import FormatDate from "../others/formatDate";
import NextMeeting from "../others/nextMeeting";
import TimeRemaining from "../others/timeRemaining";
import { useRefresh } from "../others/refreshInfo";
import { useEffect } from "react";

function MeetingInfo() {
  const { refreshTrigger } = useRefresh();
  const { getTimeRemaining } = TimeRemaining();
  const { formatDate } = FormatDate();
  const { nextMeeting } = NextMeeting();

  useEffect(() => {
    // Cette fonction vide est suffisante car NextMeeting() se chargera de rafraîchir les données
  }, [refreshTrigger]);

  // fonction qui va permettre de retourner les inititiales de la personne qui a crée la réunion
  // elle prend en paramètre un nom complet
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

  return (
    <div>
      {nextMeeting ? (
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-7 mt-5 flex flex-col md:flex-row md:items-center justify-between text-white w-full gap-6">
          {/* Partie Gauche */}
          <div className="flex flex-col items-start min-w-[100px]">
            <p className="text-sm">
              🕒 {formatDate(nextMeeting.meeting_date).formattedTime}
            </p>
            <p className="text-xs text-gray-100 mt-1">
              ⏳ {getTimeRemaining(nextMeeting.meeting_date)}
            </p>
          </div>

          {/* Trait de séparation */}
          <div className="hidden md:block h-20 border-l border-white mx-6"></div>

          {/* Milieu */}
          <div className="flex flex-col gap-1 items-start md:mr-10 flex-1">
            <h2 className="text-xl font-semibold">
              {nextMeeting.meeting_name}
            </h2>
            <p className="text-sm text-gray-100">
              📍 {nextMeeting.meeting_lieu || "Lieu non spécifié"}
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-300 text-emerald-700 font-bold flex items-center justify-center">
                {getInitials(nextMeeting.creator_name || "")}
              </div>
              <span className="text-sm">
                Crée par : {nextMeeting.creator_name}
              </span>
            </div>
          </div>

          {/* Droite */}
          <div className="flex flex-col items-end min-w-[120px]">
            <p className="text-lg font-semibold capitalize">
              {formatDate(nextMeeting.meeting_date).dayName}
            </p>
            <p className="text-sm">
              {formatDate(nextMeeting.meeting_date).fullDate}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-white">Aucune réunion à venir</p>
      )}
    </div>
  );
}

export default MeetingInfo;
