import { useState } from "react";
import MeetingFetch from "../../hook/meetingFetch";
import MeetingInfo from "./meetingInfo";
import MeetingAdd from "./meetingAdd";
import ShowMeeting from "./showMeeting";

function Meetings() {
  const { error, loading } = MeetingFetch();
  const [selectedSort, setSelectedSort] = useState("Tous");
  const options = ["Tous", "En cours", "À venir", "Passé"];

  if (loading) {
    return (
      <div className="text-center mt-20 text-blue-500 font-semibold">
        ⏳ Chargement des réunions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-semibold mt-20">
        ❌ Erreur : {error}
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex flex-col items-start bg-emerald-400 rounded-lg shadow-lg px-4 py-8 w-full lg:ml-10 lg:max-w-5xl">
          <div className="flex flex-wrap items-center gap-4 text-white">
            <span className="text-base font-semibold">Trié par</span>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedSort(option)}
                  className={`px-4 py-1 rounded-lg border transition-all duration-300 text-sm font-medium ${
                    selectedSort === option
                      ? "bg-white text-emerald-600 border-white shadow-md"
                      : "bg-emerald-500 hover:bg-white hover:text-emerald-600 border-white"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <h2 className="text-white font-semibold text-lg mt-10">
            Prochaine réunion
          </h2>
          <MeetingInfo />
        </div>
        <div className="w-full lg:max-w-xs">
          <MeetingAdd />
        </div>
      </div>
      <div className="mt-5 max-w-5xl ml-10">
        <ShowMeeting selectedSort={selectedSort} />
      </div>
    </div>
  );
}

export default Meetings;
