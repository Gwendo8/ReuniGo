import UserPresenceFetch from "../../hook/statistic/userPresenceFetch";
import NbMeeting from "./nbMeeting";
import NbPresence from "./nbPresence";
import StatCard from "./statCard";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Users, CalendarCheck, CalendarX, AlertTriangle } from "lucide-react";

function UserParticipation() {
  const { userPresence, totalUsers } = UserPresenceFetch();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const alwaysPresent = userPresence.filter(
    (user) => parseInt(user.nb_absence) === 0
  ).length;

  const oneAbsence = userPresence.filter(
    (user) => parseInt(user.nb_absence) === 1
  ).length;

  const twoAbsence = userPresence.filter(
    (user) => parseInt(user.nb_absence) === 2
  ).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 ml-10 mr-10 mt-5">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="lg:col-span-2 space-y-6"
      >
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-[#2a6b5d] mb-4">
            Statistiques de participation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard
              icon={Users}
              title="Inscrits"
              value={totalUsers}
              bgColor="bg-blue-100"
              textColor="text-blue-600"
            />
            <StatCard
              icon={CalendarCheck}
              title="Présents"
              value={alwaysPresent}
              bgColor="bg-green-100"
              textColor="text-green-600"
            />
            <StatCard
              icon={AlertTriangle}
              title="1 absence"
              value={oneAbsence}
              bgColor="bg-yellow-100"
              textColor="text-yellow-600"
            />
            <StatCard
              icon={CalendarX}
              title="2+ absences"
              value={twoAbsence}
              bgColor="bg-red-100"
              textColor="text-red-600"
            />
          </div>
        </div>
        <NbMeeting />
      </motion.div>
      <NbPresence />
    </div>
  );
}

export default UserParticipation;
