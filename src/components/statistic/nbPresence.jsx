import UserPresenceFetch from "../../hook/statistic/userPresenceFetch";
import CamembertStat from "./camembertStat";

function NbPresence() {
  const { userPresence, totalUsers, loading, error } = UserPresenceFetch();

  const alwaysPresent = userPresence.filter(
    (user) => Number.parseInt(user.nb_absence) === 0
  ).length;
  const oneAbsence = userPresence.filter(
    (user) => Number.parseInt(user.nb_absence) === 1
  ).length;
  const twoAbsence = userPresence.filter(
    (user) => Number.parseInt(user.nb_absence) === 2
  ).length;

  const donutData = [
    { label: "Présents", value: alwaysPresent, color: "#3cba92" },
    { label: "1 absence", value: oneAbsence, color: "#ffbb33" },
    { label: "2+ absences", value: twoAbsence, color: "#ff4444" },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 flex justify-center items-center h-80">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#2a6b5d]"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-red-500">Erreur lors du chargement des données</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-[#2a6b5d] mb-4">
        Répartition des présences
      </h2>
      <CamembertStat data={donutData} total={totalUsers} />
      <div className="mt-6 space-y-2">
        {donutData.map((item, index) => {
          return (
            <div key={index} className="flex items-center p-2">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-600">{item.label}</span>
              <div className="ml-auto flex items-center">
                <span className="text-sm font-medium mr-2">{item.value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NbPresence;
