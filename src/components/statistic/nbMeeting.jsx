import NbMeetingFetch from "../../hook/statistic/nbMeetingFetch";
import { AlertCircle, Loader2 } from "lucide-react";

function NbMeeting() {
  const { nbMeeting, rateMeetings, loading, error } = NbMeetingFetch();

  const pastMeeting = nbMeeting[0]?.past_meetings ?? 0;
  const futureMeeting = nbMeeting[0]?.future_meetings ?? 0;
  const onGoingMeeting = nbMeeting[0]?.ongoing_meetings ?? 0;
  const rateMeeting = rateMeetings;

  const meetingStats = [
    {
      label: "Réunions planifiées",
      value: futureMeeting,
      color: "#3cba92",
    },
    {
      label: "Réunions terminées",
      value: pastMeeting,
      color: "#0ba360",
    },
    {
      label: "Réunions en cours",
      value: onGoingMeeting,
      color: "#ff4444",
    },
    { label: "Taux de participation", value: rateMeeting, color: "#3cba92" },
  ];
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-[#2a6b5d] mb-4">
        Statistiques des réunions
      </h2>
      {/* Chargement */}
      {loading && (
        <div className="flex items-center justify-center text-gray-500">
          <Loader2 className="animate-spin mr-2" size={18} />
          Chargement en cours...
        </div>
      )}
      {/* Erreur */}
      {error && (
        <div className="flex items-center justify-center text-red-600 bg-red-100 p-3 rounded-lg">
          <AlertCircle className="mr-2" size={18} />
          {error}
        </div>
      )}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {meetingStats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center p-4 bg-gray-50 rounded-lg"
            >
              <div className={`w-2 h-10 ${stat.color} rounded-full mr-3`}></div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold">
                  {stat.label === "Taux de participation"
                    ? `${stat.value} %`
                    : stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NbMeeting;
