/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
const ProgressBar = ({ label, value, max, color }) => (
  <div className="mb-4">
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
      <motion.div
        className={`${color} h-2`}
        initial={{ width: 0 }}
        animate={{ width: `${(value / (max || 1)) * 100}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      ></motion.div>
    </div>
  </div>
);
export default ProgressBar;
