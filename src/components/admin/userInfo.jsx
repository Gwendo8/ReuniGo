import { useState, useContext } from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Plus, Trash2, Filter } from "lucide-react";
import useToggle from "../others/useToggle";
import CardInfo from "./cardInfo";
import { useRefresh } from "../others/refreshInfo";
import CreateUser from "./createUser";
import SearchBar from "../others/searchBar";
import UserInfoFetch from "../../hook/admin/userInfoFetch";
import DeleteUserFetch from "../../hook/admin/deleteUserFetch";
import { ThemeContext } from "../others/themeContext";
import BoutonCreateUser from "../button/button-create-user";

function UserInfo() {
  const { theme } = useContext(ThemeContext);
  const { refreshTrigger, handleCloseCard } = useRefresh();
  const { loading, error, data } = UserInfoFetch(refreshTrigger);
  const [isOpen, toggleOpen] = useToggle(false);
  const [createIsOpen, toggleCreateIsOpen] = useToggle(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchUser, setSearchUser] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const { errorDelete, deleteUser } = DeleteUserFetch();

  // Fonction pour gérer le clic sur une carte utilisateur
  const handleUserClick = (userId) => {
    const user = data.find((user) => user.sgid === userId);
    setSelectedUser(user);
    toggleOpen();
  };

  const handleCreateUser = () => {
    toggleCreateIsOpen();
  };

  const handleDeleteUser = (sgid) => {
    const confirm = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
    );
    if (!confirm) return;
    deleteUser(sgid, () => {
      console.log("Utilisateur supprimé et refresh déclenché");
    });
  };

  const handleSearchUser = (text) => {
    setSearchUser(text);
  };

  // Extraire tous les rôles uniques pour le filtre
  const uniqueRoles = data
    ? [...new Set(data.map((user) => user.rolename))].sort()
    : [];

  // Filtrer les utilisateurs par recherche et par rôle
  const filteredUsers = data
    ? data.filter(
        (user) =>
          `${user.firstname} ${user.lastname}`
            .toLowerCase()
            .includes(searchUser.toLowerCase()) &&
          (filterRole === "" || user.rolename === filterRole)
      )
    : [];

  // Fonction qui permet de générer une couleur en fonction du rôle
  const getRoleColor = (role) => {
    const roleColors = {
      admin:
        theme === "dark"
          ? "bg-red-900/30 text-red-300"
          : "bg-red-100 text-red-800",
      user:
        theme === "dark"
          ? "bg-blue-900/30 text-blue-300"
          : "bg-blue-100 text-blue-800",
      manager:
        theme === "dark"
          ? "bg-green-900/30 text-green-300"
          : "bg-green-100 text-green-800",
      guest:
        theme === "dark"
          ? "bg-yellow-900/30 text-yellow-300"
          : "bg-yellow-100 text-yellow-800",
    };
    const roleLower = role.toLowerCase();
    return (
      roleColors[roleLower] ||
      (theme === "dark"
        ? "bg-purple-900/30 text-purple-300"
        : "bg-purple-100 text-purple-800")
    );
  };

  return (
    <div className="min-h-screen">
      {loading && (
        <div
          className={`text-center text-lg font-medium mt-20 ${
            theme === "dark" ? "text-cyan-400" : "text-blue-600"
          }`}
        >
          ⏳ Chargement...
        </div>
      )}

      {error && (
        <div
          className={`text-center font-semibold mt-20 ${
            theme === "dark" ? "text-red-400" : "text-red-500"
          }`}
        >
          ❌ Erreur : {error.toString()}
        </div>
      )}

      {errorDelete && (
        <div
          className={`text-center font-semibold mt-10 ${
            theme === "dark" ? "text-red-400" : "text-red-500"
          }`}
        >
          ❌ Erreur lors de la suppression : {errorDelete.toString()}
        </div>
      )}

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col md:flex-row md:justify-between items-center mt-10 px-6">
        <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
          <SearchBar
            onSearch={handleSearchUser}
            placeholder="Recherche un utilisateur par son nom ou son prénom..."
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row items-center sm:gap-3 sm:mt-4 md:mt-0">
          <div className="relative">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:outline-none appearance-none ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-cyan-400"
                  : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              }`}
            >
              <option value="">Tous les rôles</option>
              {uniqueRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <Filter
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                theme === "dark" ? "text-gray-400" : "text-gray-400"
              }`}
            />
          </div>

          <BoutonCreateUser
            value="Créer un utilisateur"
            onClick={handleCreateUser}
          >
            <Plus className="w-5 h-5 mr-2" />
          </BoutonCreateUser>
        </div>
      </div>

      {/* Affichage du nombre de résultats */}
      {!loading && data && (
        <div className="px-6 mt-4">
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {filteredUsers.length} utilisateur
            {filteredUsers.length !== 1 ? "s" : ""} trouvé
            {filteredUsers.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* Grille des utilisateurs */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <motion.div
              key={user.sgid}
              whileHover={{
                y: -5,
                boxShadow:
                  theme === "dark"
                    ? "0 10px 15px -3px rgba(0, 0, 0, 0.3)"
                    : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
              className={`rounded-lg shadow-md p-5 border cursor-pointer transition-colors ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 hover:bg-slate-700"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => handleUserClick(user.sgid)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-3 ${
                      theme === "dark"
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {user.firstname.charAt(0)}
                    {user.lastname.charAt(0)}
                  </div>
                  <div>
                    <div
                      className={`text-lg font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {user.firstname} {user.lastname}
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                        user.rolename
                      )}`}
                    >
                      {user.rolename}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteUser(user.sgid);
                  }}
                  className={`transition-colors ${
                    theme === "dark"
                      ? "text-gray-500 hover:text-red-400"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                  title="Supprimer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-3 space-y-2 text-sm">
                <div
                  className={`flex items-center ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <span
                    className={`font-medium mr-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    SGID:
                  </span>
                  {user.sgid}
                </div>
                <div
                  className={`flex items-center truncate ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <span
                    className={`font-medium mr-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Email:
                  </span>
                  <span className="truncate">{user.mail}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Message si aucun utilisateur trouvé */}
        {!loading && filteredUsers.length === 0 && (
          <div
            className={`text-center mt-10 ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Aucun utilisateur ne correspond à votre recherche.
          </div>
        )}
      </div>

      {/* Modales */}
      {isOpen && selectedUser && (
        <CardInfo userSelect={selectedUser} closeToggle={handleCloseCard} />
      )}
      {createIsOpen && <CreateUser closeToggle={handleCloseCard} />}
    </div>
  );
}

export default UserInfo;
