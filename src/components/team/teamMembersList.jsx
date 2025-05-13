import { FaUser, FaTrash } from "react-icons/fa";

function TeamMembersList({ members, teamColor, onRemoveMember }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-1 text-gray-700 max-h-[200px] overflow-y-auto border border-gray-100">
      {members && members.length > 0 ? (
        members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-2 hover:bg-white rounded-md border border-transparent hover:border-gray-200"
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
              className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 flex items-center justify-center"
              onClick={() => onRemoveMember(member.id)}
              title="Supprimer"
            >
              <FaTrash size={14} />
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center py-3">
          Aucun membre disponible
        </p>
      )}
    </div>
  );
}

export default TeamMembersList;
