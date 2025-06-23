import { useContext } from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { ThemeContext } from "../others/themeContext";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const StatCard = ({
  icon: Icon,
  title,
  value,
  bgColor,
  textColor = "text-white",
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <motion.div
      variants={itemVariants}
      className={`p-5 rounded-xl shadow-md flex items-center space-x-4 hover:shadow-lg transition-shadow duration-200 ${
        theme === "dark"
          ? "bg-slate-800/95 border border-slate-700/50"
          : "bg-white"
      }`}
    >
      <div className={`p-3 rounded-xl ${textColor} shadow-md ${bgColor}`}>
        {Icon && <Icon size={24} />}
      </div>
      <div>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {title}
        </p>
        <p
          className={`text-xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {value}
        </p>
      </div>
    </motion.div>
  );
};

export default StatCard;
