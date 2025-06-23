"use client";

import { useContext } from "react";
import UserPresenceFetch from "../../hook/statistic/userPresenceFetch";
import CamembertStat from "./camembertStat";
import { ThemeContext } from "../others/themeContext";

function NbPresence() {
  const { theme } = useContext(ThemeContext);
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
      <div
        className={`rounded-xl shadow-md p-6 flex justify-center items-center h-80 ${
          theme === "dark"
            ? "bg-slate-800/95 border border-slate-700/50"
            : "bg-white"
        }`}
      >
        <div
          className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${
            theme === "dark" ? "border-cyan-400" : "border-[#2a6b5d]"
          }`}
        ></div>
      </div>
    );
  }
  if (error) {
    return (
      <div
        className={`rounded-xl shadow-md p-6 ${
          theme === "dark"
            ? "bg-slate-800/95 border border-slate-700/50"
            : "bg-white"
        }`}
      >
        <p className={theme === "dark" ? "text-red-300" : "text-red-500"}>
          Erreur lors du chargement des données
        </p>
      </div>
    );
  }
  return (
    <div
      className={`rounded-xl shadow-md p-6 ${
        theme === "dark"
          ? "bg-slate-800/95 border border-slate-700/50"
          : "bg-white"
      }`}
    >
      <h2
        className={`text-lg font-semibold mb-4 ${
          theme === "dark" ? "text-cyan-400" : "text-[#2a6b5d]"
        }`}
      >
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
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {item.label}
              </span>
              <div className="ml-auto flex items-center">
                <span
                  className={`text-sm font-medium mr-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NbPresence;
