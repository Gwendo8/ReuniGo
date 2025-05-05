"use client";

import { useState } from "react";
import UserInfoFetch from "../../hook/userInfoFetch";
import useToggle from "../others/useToggle";
import CardInfo from "./cardInfo";
import BoutonInsc from "../button/bouton-ins";
import { Plus, Trash2, Filter } from "lucide-react";
import { useRefresh } from "../others/refreshInfo";
import CreateUser from "./createUser";
import DeleteUserFetch from "../../hook/deleteUserFetch";
import SearchBar from "../others/searchBar";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

function UserInfo() {
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
      admin: "bg-red-100 text-red-800",
      user: "bg-blue-100 text-blue-800",
      manager: "bg-green-100 text-green-800",
      guest: "bg-yellow-100 text-yellow-800",
    };
    // La je convertis le rôle en minuscules pour la comparaison
    const roleLower = role.toLowerCase();
    // Puis on retourne la couleur du rôle ou une couleur par défaut si le rôle n'est pas trouvé
    return roleColors[roleLower] || "bg-purple-100 text-purple-800";
  };

  return (
    <div className="min-h-screen">
      {loading && (
        <div className="text-center text-blue-600 text-lg font-medium mt-20">
          ⏳ Chargement...
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 font-semibold mt-20">
          ❌ Erreur : {error.toString()}
        </div>
      )}

      {errorDelete && (
        <div className="text-center text-red-500 font-semibold mt-10">
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
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-gray-700"
            >
              <option value="">Tous les rôles</option>
              {uniqueRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>

          <BoutonInsc value="Créer un utilisateur" onClick={handleCreateUser}>
            <Plus className="w-5 h-5 mr-2" />
          </BoutonInsc>
        </div>
      </div>
      {/* Affichage du nombre de résultats */}
      {!loading && data && (
        <div className="px-6 mt-4">
          <p className="text-sm text-gray-500">
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
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
              className="bg-white rounded-lg shadow-md p-5 border border-gray-200 cursor-pointer"
              onClick={() => handleUserClick(user.sgid)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg mr-3">
                    {user.firstname.charAt(0)}
                    {user.lastname.charAt(0)}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-800">
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
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center text-gray-500">
                  <span className="font-medium text-gray-700 mr-2">SGID:</span>
                  {user.sgid}
                </div>
                <div className="flex items-center text-gray-600 truncate">
                  <span className="font-medium text-gray-700 mr-2">Email:</span>
                  <span className="truncate">{user.mail}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Message si aucun utilisateur trouvé */}
        {!loading && filteredUsers.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
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
