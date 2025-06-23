import { useContext } from "react";
import Navbar from "../components/navbar/navbar";
import UserParticipation from "../components/statistic/userParticipation";
import UserPresence from "../components/statistic/userPresence";
import { ThemeContext } from "../components/others/themeContext";

function Statistics() {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`min-h-screen p-4 font-sans ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900"
          : "bg-gradient-to-br from-white via-blue-50 to-blue-100"
      }`}
    >
      <Navbar />
      <div className="ml-10">
        <h1
          className={`text-2xl font-bold mt-5 ${
            theme === "dark" ? "text-cyan-400" : "text-[#2a6b5d]"
          }`}
        >
          Tableau de bord statistiques
        </h1>
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
          Suivi de la participation des utilisateurs
        </p>
      </div>
      <UserParticipation />
      <UserPresence />
    </div>
  );
}

export default Statistics;
