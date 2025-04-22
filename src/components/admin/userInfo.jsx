import { useState } from "react";
import UserInfoFetch from "../../hook/userInfoFetch";
import useToggle from "../others/useToggle";
import CardInfo from "./cardInfo";
import BoutonInsc from "../button/bouton-ins";
import { Plus } from "lucide-react";
import { useRefresh } from "../others/refreshInfo";
import CreateUser from "./createUser";
import DeleteUserFetch from "../../hook/deleteUserFetch";
import { Trash2 } from "lucide-react";
import SearchBar from "../others/searchBar";

function UserInfo() {
  const { refreshTrigger, handleCloseCard } = useRefresh();
  // la je dis que je vais utiliser le composant UserInfoFetch
  // et que dans ce composant je vais lui passer le paramètre refreshTrigger
  // qui va lui permettre de se déclencher à chaque fois que je vais l'appeler
  // donc à chaque fois que je vais faire un appel à l'API
  const { loading, error, data } = UserInfoFetch(refreshTrigger);

  // j'utilise mon components useToggle pour pouvoir fermer la pop up avec les infos supplémentaires de l'utilisateur
  const [isOpen, toggleOpen] = useToggle(false);
  // je déclare un état pour gérer le fait si la pop up de création d'utilisateur est ouverte ou pas
  const [createIsOpen, toggleCreateIsOpen] = useToggle(false);
  const [selectedUser, setSelectedUser] = useState(null);
  // Fonction pour gérer le clic sur une carte utilisateur
  const handleUserClick = (userId) => {
    // on parcours le tableau data avec le find qui va créer un résultat avec la condition validé
    // si la valeur de user.sgid qui est qui est le sgid de l'utilisateur dans l'objet est égal au userId passé en paramètre
    const user = data.find((user) => user.sgid === userId);
    setSelectedUser(user); // On met à jour l'utilisateur sélectionné
    // du coup la la pop up s'ouvre
    toggleOpen();
  };

  const handleCreateUser = () => {
    toggleCreateIsOpen();
  };

  const { errorDelete, deleteUser } = DeleteUserFetch();
  const handleDeleteUser = (sgid) => {
    const confirm = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
    );
    if (!confirm) return; // Si l'utilisateur annule la suppression, on ne fait rien
    deleteUser(sgid, () => {
      console.log("Utilisateur supprimé et refresh déclenché");
    });
  };

  const [searchUser, setSearchUser] = useState("");
  // dès qu'un utilisateur va saisir quelque chose dans la barre de recherche
  const handleSearchUser = (text) => {
    // ça va stocker la valeur dans la variable searchUser
    setSearchUser(text);
  };

  return (
    <div className="min-h-screen">
      {loading && (
        <div className="text-center text-blue-600 text-lg font-medium mt-20">
          ⏳ Chargement...
        </div>
      )}
      {/* Affichage du message d'erreur pour la récupération des utilisateurs */}
      {error && (
        <div className="text-center text-red-500 font-semibold mt-20">
          ❌ Erreur : {error.toString()}
        </div>
      )}

      {/* Affichage du message d'erreur pour la suppression d'un utilisateur */}
      {errorDelete && (
        <div className="text-center text-red-500 font-semibold mt-10">
          ❌ Erreur lors de la suppression : {errorDelete.toString()}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-10 px-6">
        <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
          <SearchBar
            onSearch={handleSearchUser}
            placeholder="Recherche un utilisateur par son nom ou son prénom..."
          />
        </div>

        <BoutonInsc value="Créer un utilisateur" onClick={handleCreateUser}>
          <Plus className="w-5 h-5 mr-2" />
        </BoutonInsc>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {data &&
            data
              .filter((user) =>
                `${user.firstname} ${user.lastname}`
                  .toLowerCase()
                  .includes(searchUser.toLowerCase())
              )
              .map((user) => (
                <div
                  key={user.sgid}
                  className="relative bg-white rounded-lg shadow-lg p-6 flex flex-col gap-3 border border-blue-100 transition-all hover:shadow-2xl hover:border-blue-300 group"
                  onClick={() => handleUserClick(user.sgid)}
                >
                  {/* Bouton supprimer en haut à droite, visible au survol */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUser(user.sgid);
                    }}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity transform hover:scale-110 duration-200"
                    title="Supprimer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="text-lg font-semibold text-gray-800">
                    {user.firstname} {user.lastname}
                  </div>
                  <div className="text-sm text-gray-500">
                    SGID : {user.sgid}
                  </div>
                  <div className="text-sm text-gray-600">
                    📧 Email : {user.mail}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    🎓 Rôle : {user.rolename}
                  </div>
                </div>
              ))}
        </div>
      </div>
      {/* Affichage des informations détaillées de l'utilisateur sélectionné et si la pop up est ouverte */}
      {isOpen && selectedUser && (
        <CardInfo userSelect={selectedUser} closeToggle={handleCloseCard} /> // On passe l'utilisateur sélectionné à OpenCard
        // et on passe la fonction toggleOpen pour fermer la pop up
      )}
      {createIsOpen && <CreateUser closeToggle={handleCloseCard} />}
    </div>
  );
}

export default UserInfo;
