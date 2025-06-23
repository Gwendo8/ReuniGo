import { Trash2 } from "lucide-react";
import { FaUserFriends } from "react-icons/fa";
import { useContext } from "react";
import { ThemeContext } from "../others/themeContext";

function TeamCard({ team, onDelete, onViewDetails }) {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`relative rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition duration-300 flex flex-col h-full ${
        theme === "dark"
          ? "bg-slate-700 border-slate-600"
          : "bg-white border-gray-100"
      }`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(team.team_id);
        }}
        className={`transition-colors top-2 right-2 absolute z-10 ${
          theme === "dark"
            ? "text-gray-500 hover:text-red-400"
            : "text-gray-400 hover:text-red-500"
        }`}
        title="Supprimer"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-white"
            style={{ backgroundColor: team.team_colors }}
          >
            {team.team_name.charAt(0).toUpperCase()}
          </div>

          <h3
            className={`text-lg font-semibold break-words line-clamp-2 leading-tight ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            {team.team_name}
          </h3>
        </div>

        <div className="mt-auto">
          {team.members && (
            <div
              className={`mt-3 flex items-center text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <FaUserFriends className="mr-2 flex-shrink-0" />
              <span>{team.members.length} membres</span>
            </div>
          )}

          <div
            className={`mt-4 pt-3 border-t ${
              theme === "dark" ? "border-slate-600" : "border-gray-100"
            }`}
          >
            <button
              onClick={() => onViewDetails(team)}
              className="text-sm hover:underline font-medium flex items-center"
              style={{ color: team.team_colors }}
            >
              Voir les détails →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamCard;
