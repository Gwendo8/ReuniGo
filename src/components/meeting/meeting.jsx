import { useEffect, useState, useContext } from "react";
import MeetingInfo from "./meetingInfo";
import MeetingAdd from "./meetingAdd";
import ShowMeeting from "./showMeeting";
import { useRefresh } from "../others/refreshInfo";
import MeetingFetch from "../../hook/meeting/meetingFetch";
import { ThemeContext } from "../others/themeContext";

function Meetings() {
  const { theme } = useContext(ThemeContext);
  const { refreshTrigger } = useRefresh();
  const { error, loading, fetchData } = MeetingFetch();
  const [selectedSort, setSelectedSort] = useState("Tous");
  const options = ["Tous", "En cours", "À venir", "Passé"];

  useEffect(() => {
    fetchData();
  }, [refreshTrigger, fetchData]);

  if (loading) {
    return (
      <div
        className={`text-center mt-20 font-semibold ${
          theme === "dark" ? "text-cyan-400" : "text-blue-500"
        }`}
      >
        ⏳ Chargement des réunions...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`text-center font-semibold mt-20 ${
          theme === "dark" ? "text-red-400" : "text-red-500"
        }`}
      >
        ❌ Erreur : {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col lg:flex-row gap-5">
        <div
          className={`flex flex-col items-start rounded-lg shadow-lg px-4 py-8 w-full lg:ml-10 lg:max-w-5xl ${
            theme === "dark"
              ? "bg-gradient-to-r from-cyan-600 to-blue-700"
              : "bg-emerald-400"
          }`}
        >
          <div className="flex flex-wrap items-center gap-4 text-white">
            <span className="text-base font-semibold">Trier par</span>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedSort(option)}
                  className={`px-4 py-1 rounded-lg border transition-all duration-300 text-sm font-medium ${
                    selectedSort === option
                      ? theme === "dark"
                        ? "bg-white text-cyan-600 border-white shadow-md"
                        : "bg-white text-emerald-600 border-white shadow-md"
                      : theme === "dark"
                      ? "bg-cyan-500 hover:bg-white hover:text-cyan-600 border-white"
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
      <div className="mt-5 max-w-5xl lg:ml-10">
        <ShowMeeting selectedSort={selectedSort} />
      </div>
    </div>
  );
}

export default Meetings;
