import UserPresenceFetch from "../../hook/statistic/userPresenceFetch";
import NbRoleUser from "./nbRoleUser";
import ProgressBar from "./progressBar";
import UserTopAbsence from "./userTopAbsence";

function UserPresence() {
  const { userPresence, totalUsers } = UserPresenceFetch();

  const alwaysPresent = userPresence.filter(
    (user) => parseInt(user.nb_absence) === 0
  ).length;

  const oneAbsence = userPresence.filter(
    (user) => parseInt(user.nb_absence) === 1
  ).length;

  const twoAbsence = userPresence.filter(
    (user) => parseInt(user.nb_absence) === 2
  ).length;

  const moreThanThreeAbsence = userPresence.filter(
    (user) => parseInt(user.nb_absence) > 2
  ).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ml-10 mr-10 mt-5">
      <NbRoleUser />
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-[#2a6b5d] mb-4">
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
