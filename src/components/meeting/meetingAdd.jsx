import { Plus } from "lucide-react";
import NextMeeting from "../others/nextMeeting";
import FormatDate from "../others/formatDate";
import useToggle from "../others/useToggle";

function MeetingAdd() {
  const { nextMeeting } = NextMeeting();
  const { formatDate } = FormatDate();
  const [isComing, setIsComing] = useToggle(false);

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
    <div className="bg-white rounded-lg shadow-lg p-4 mt-4 flex flex-col w-full text-white">
      <button className="bg-emerald-700 hover:bg-emerald-800 transition-all duration-300 rounded-md px-4 py-3 flex items-center justify-center gap-2">
        <Plus size={18} className="text-white" />
        <span className="text-sm font-semibold text-white">
          Ajouter une réunion
        </span>
      </button>

      <div className="mt-4 w-full sm:w-1/2 bg-gray-200 bg-opacity-40 text-gray-800 text-sm font-medium px-4 py-2 rounded-lg text-center">
        Invitation
      </div>

      <hr className="mt-4 border-t border-gray-300" />

      {nextMeeting ? (
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h2 className="text-md text-emerald-800 font-normal break-words w-full sm:w-1/2">
              {nextMeeting.meeting_name}
            </h2>
            <p className="text-sm text-black break-words w-full sm:w-1/4">
              🕒 {formatDate(nextMeeting.meeting_date).formattedTime}
            </p>
            <div className="flex justify-end mt-2 sm:mt-0 w-full sm:w-1/4">
              <div className="w-8 h-8 rounded-full bg-gray-100 text-red-500 font-semibold flex items-center justify-center">
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

      <div className="flex justify-between mt-4 items-center">
        <p className="text-gray-600 text-sm">Je viens</p>
        <label className="relative inline-block w-12 h-6">
          <input
            type="checkbox"
            className="peer opacity-0 w-0 h-0"
            checked={isComing}
            onChange={setIsComing}
          />
          <span className="absolute inset-0 rounded-full bg-gray-300 peer-checked:bg-emerald-600 transition duration-200"></span>
          <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition duration-200 peer-checked:translate-x-6"></span>
        </label>
      </div>
    </div>
  );
}

export default MeetingAdd;
