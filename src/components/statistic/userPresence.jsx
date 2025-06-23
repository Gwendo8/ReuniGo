import UserPresenceFetch from "../../hook/statistic/userPresenceFetch";
import NbRoleUser from "./nbRoleUser";
import ProgressBar from "./progressBar";
import UserTopAbsence from "./userTopAbsence";
import { useContext } from "react";
import { ThemeContext } from "../others/themeContext";

function UserPresence() {
  const { theme } = useContext(ThemeContext);
  const { userPresence, totalUsers } = UserPresenceFetch();

  const alwaysPresent = userPresence.filter(
    (user) => Number.parseInt(user.nb_absence) === 0
  ).length;

  const oneAbsence = userPresence.filter(
    (user) => Number.parseInt(user.nb_absence) === 1
  ).length;

  const twoAbsence = userPresence.filter(
    (user) => Number.parseInt(user.nb_absence) === 2
  ).length;

  const moreThanThreeAbsence = userPresence.filter(
    (user) => Number.parseInt(user.nb_absence) > 2
  ).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ml-10 mr-10 mt-5">
      <NbRoleUser />
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
          Répartition des absences
        </h2>
        <div className="space-y-3">
          <ProgressBar
            label="1 absence"
            value={oneAbsence}
            max={totalUsers}
            color="bg-yellow-400"
          />
          <ProgressBar
            label="2 absences"
            value={twoAbsence}
            max={totalUsers}
            color="bg-orange-500"
          />
          <ProgressBar
            label="3+ absences"
            value={moreThanThreeAbsence}
            max={totalUsers}
            color="bg-red-500"
          />
          <ProgressBar
            label="Présents"
            value={alwaysPresent}
            max={totalUsers}
            color="bg-[#3cba92]"
          />
        </div>
      </div>
      <UserTopAbsence />
    </div>
  );
}

export default UserPresence;
