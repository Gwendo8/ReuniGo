/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaSearch } from "react-icons/fa";

function AddTeamMembers({
  showAddMembers,
  setShowAddMembers,
  availableUsers,
  onAddMember,
  searchTerm,
  setSearchTerm,
}) {
  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">
          Membres de l'équipe
        </h3>
        <button
          onClick={() => setShowAddMembers(!showAddMembers)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            showAddMembers
              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {showAddMembers ? (
            <>Fermer</>
          ) : (
            <>
              <FaPlus size={12} />
              Ajouter
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {showAddMembers && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-3"
          >
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
              <div className="relative mb-3">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="max-h-[150px] overflow-y-auto bg-white rounded-lg border border-gray-200">
                {availableUsers.length > 0 ? (
                  availableUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          {user.firstname[0]}
                          {user.lastname[0]}
                        </div>
                        <span className="text-black">
                          {user.firstname} {user.lastname}
                        </span>
                      </div>
                      <button
                        onClick={() => onAddMember(user)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1.5 rounded-full"
                      >
                        <FaPlus size={14} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    {searchTerm
                      ? "Aucun utilisateur trouvé"
                      : "Tous les utilisateurs sont déjà membres"}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AddTeamMembers;
