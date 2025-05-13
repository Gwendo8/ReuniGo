import { FaTimes, FaUsers } from "react-icons/fa";

function ModalHeader({ title, onClose }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaUsers className="text-white" />
          {title}
        </h2>
        <button
          onClick={onClose}
          className="bg-white/20 hover:bg-white/30 transition text-white rounded-full p-2"
          title="Fermer"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
}

export default ModalHeader;
