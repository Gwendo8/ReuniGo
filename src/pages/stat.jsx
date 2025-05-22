import Navbar from "../components/navbar/navbar";
import UserParticipation from "../components/statistic/userParticipation";
import UserPresence from "../components/statistic/userPresence";

function Statistics() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 p-4 font-sans">
      <Navbar />

      <div className="ml-10">
        <h1 className="text-2xl font-bold text-[#2a6b5d] mt-5">
          Tableau de bord statistiques
        </h1>
        <p className="text-gray-500">
          Suivi de la participation des utilisateurs
        </p>
      </div>
      <UserParticipation />
      <UserPresence />
    </div>
  );
}

export default Statistics;
