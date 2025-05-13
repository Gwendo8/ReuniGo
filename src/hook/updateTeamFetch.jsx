import axios from "axios";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";

function useUpdateTeamFetch({ team }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // La je créer des états pour permettre de récupérer le nom et la couleur déja présente dans l'équipe
  const [localTeamName, setLocalTeamName] = useState(team?.team_name || "");
  const [localColors, setLocalColors] = useState(team?.team_colors || "");
  const [localMembers, setLocalMembers] = useState(team?.members || []);
  const [users, setUsers] = useState([]);

  // La j'utilise le useEffect pour mettre a jours les nouveaux états en fonction de quand team va changer
  useEffect(() => {
    if (team) {
      setLocalTeamName(team.team_name);
      setLocalColors(team.team_colors);
      setLocalMembers(team.members || []);
    }
  }, [team]);

  useEffect(() => {
    const showUsers = async () => {
      try {
        const usersReponse = await axios.get(
          `http://localhost:8000/usersmeeting`
        );
        setUsers(usersReponse.data);
        console.log(
          "Utilisateur dispo pour la modification d'une équipe : ",
          usersReponse.data
        );
      } catch (err) {
        console.error("Erreur lors de la récupération des utilisateurs:", err);
        setError("Erreur lors du chargement des utilisateurs.");
      }
    };
    showUsers();
  }, []);

  const updateTeam = async (id, teamName, colors, leaderId, members) => {
    if (!id) {
      setError("L'id de l'équipe n'est pas défini");
      return;
    }

    const currentToken = localStorage.getItem("token");

    if (!currentToken) {
      setError("Aucun jeton d'authentification trouvé");
      return;
    }

    try {
      const decodedToken = jwtDecode(currentToken);
      const userRole = decodedToken.rolename;
      const userId = decodedToken.id;

      if (
        userRole === "ADMIN" ||
        (userRole === "MANAGER" && team?.leader_id === userId)
      ) {
        setLoading(true);
        const response = await axios.put(
          `http://localhost:8000/update-team/${id}`,
          {
            teamName,
            colors,
            leaderId,
            members,
          }
        );
        console.log(response.data);
        setLoading(false);
      } else {
        setError("Vous n'êtes pas autorisé à modifier cette équipe");
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        if (error.response.status === 404) {
          setError("Equipe non trouvée");
        }
      } else {
        setError("Erreur serveur");
      }
    }
  };

  return {
    updateTeam,
    localTeamName,
    setLocalTeamName,
    localColors,
    setLocalColors,
    localMembers,
    setLocalMembers,
    users,
    error,
    loading,
  };
}

export default useUpdateTeamFetch;
