import { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { API } from "../../api";

function AddTeamFetch() {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [colors, setColors] = useState("#000000");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Récupération de la liste de tous les utilisateurs pour le sélecteur de membres
    const fetchUsers = async () => {
      try {
        const usersRes = await axios.get(`${API}/usersmeeting`);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des utilisateurs:", err);
        setError("Erreur lors du chargement des utilisateurs.");
      }
    };
    fetchUsers();
  }, []);

  const handleCreateTeam = async (onSuccess) => {
    setLoading(true);
    setError("");
    if (!teamName.trim()) {
      setError("Le nom de l'équipe est requis.");
      setLoading(false);
      return;
    }
    if (!selectedMembers || selectedMembers.length === 0) {
      setError("Veuillez sélectionner au moins un membre pour l'équipe.");
      setLoading(false);
      return;
    }
    const currentToken = localStorage.getItem("token");
    let creatorId = null;
    if (currentToken) {
      try {
        const decodedToken = jwtDecode(currentToken);
        creatorId = decodedToken.id;
      } catch (decodeError) {
        console.error("Erreur lors du décodage du token:", decodeError);
        setError("Erreur d'authentification. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }
    } else {
      setError("Utilisateur non authentifié. Veuillez vous connecter.");
      setLoading(false);
      return;
    }
    // Extraire les IDs des membres sélectionnés
    const memberIds = selectedMembers.map((member) => member.id);
    try {
      const response = await axios.post(`${API}/create-team`, {
        teamName,
        colors,
        members: memberIds,
        creatorId,
      });
      console.log("Création d'équipe réussie", response.data);
      setTeamName("");
      setColors("");
      setSelectedMembers([]);
      if (onSuccess) {
        onSuccess();
      }
      navigate("/meeting");
    } catch (apiError) {
      console.error("Erreur lors de la création de l'équipe:", apiError);
      if (apiError.response && apiError.response.data) {
        setError(
          apiError.response.data.message ||
            "Erreur lors de la création de l'équipe."
        );
      } else {
        setError("Erreur serveur lors de la création de l'équipe.");
      }
    } finally {
      setLoading(false);
    }
  };
  return {
    teamName,
    setTeamName,
    colors,
    setColors,
    selectedMembers,
    setSelectedMembers,
    users,
    handleCreateTeam,
    loading,
    error,
  };
}

export default AddTeamFetch;
