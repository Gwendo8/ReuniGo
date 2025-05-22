/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
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
}) => (
  <motion.div
    variants={itemVariants}
    className="bg-white p-5 rounded-xl shadow-md flex items-center space-x-4 hover:shadow-lg transition-shadow duration-200"
  >
    <div className={`p-3 rounded-xl ${textColor} shadow-md ${bgColor}`}>
      {Icon && <Icon size={24} />}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </motion.div>
);

export default StatCard;
