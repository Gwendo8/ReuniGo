import { useContext } from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { ThemeContext } from "../others/themeContext";

const ProgressBar = ({ label, value, max, color }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
          {label}
        </span>
        <span
          className={`font-medium ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {value}
        </span>
      </div>
      <div
        className={`w-full h-2 rounded-full overflow-hidden ${
          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
        }`}
      >
        <motion.div
          className={`${color} h-2`}
          initial={{ width: 0 }}
          animate={{ width: `${(value / (max || 1)) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        ></motion.div>
      </div>
    </div>
  );
};

export default ProgressBar;
