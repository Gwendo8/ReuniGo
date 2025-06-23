import { useContext } from "react";
import { FaUser, FaTrash } from "react-icons/fa";
import { ThemeContext } from "../others/themeContext";

function TeamMembersList({ members, teamColor, onRemoveMember }) {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`p-4 rounded-lg space-y-1 max-h-[200px] overflow-y-auto border ${
        theme === "dark"
          ? "bg-slate-700 text-gray-200 border-slate-600"
          : "bg-gray-50 text-gray-700 border-gray-100"
      }`}
    >
      {members && members.length > 0 ? (
        members.map((member) => (
          <div
            key={member.id}
            className={`flex items-center justify-between p-2 rounded-md border border-transparent ${
              theme === "dark"
                ? "hover:bg-slate-600 hover:border-slate-500"
                : "hover:bg-white hover:border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className="p-1.5 rounded-full"
                style={{ backgroundColor: `${teamColor}20` }}
              >
                <FaUser style={{ color: teamColor }} className="text-sm" />
              </div>
              <span>
                {member.firstname} {member.lastname}
              </span>
            </div>
            <button
              className={`p-1.5 rounded-full flex items-center justify-center ${
                theme === "dark"
                  ? "text-gray-500 hover:text-red-400 hover:bg-red-900/20"
                  : "text-gray-400 hover:text-red-500 hover:bg-red-50"
              }`}
              onClick={() => onRemoveMember(member.id)}
              title="Supprimer"
            >
              <FaTrash size={14} />
            </button>
          </div>
        ))
      ) : (
        <p
          className={`text-center py-3 ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Aucun membre disponible
        </p>
      )}
    </div>
  );
}

export default TeamMembersList;
