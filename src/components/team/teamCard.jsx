import { Trash2 } from "lucide-react";
import { FaUserFriends } from "react-icons/fa";

function TeamCard({ team, onDelete, onViewDetails }) {
  return (
    <div className="relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition duration-300 flex flex-col h-full">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(team.team_id);
        }}
        className="text-gray-400 hover:text-red-500 transition-colors top-2 right-2 absolute z-10"
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

          <h3 className="text-lg font-semibold text-gray-800 break-words line-clamp-2 leading-tight">
            {team.team_name}
          </h3>
        </div>

        <div className="mt-auto">
          {team.members && (
            <div className="mt-3 flex items-center text-gray-500 text-sm">
              <FaUserFriends className="mr-2 flex-shrink-0" />
              <span>{team.members.length} membres</span>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-gray-100">
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
