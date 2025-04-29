import axios from "axios";
import jwtDecode from "jwt-decode";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRefresh } from "../components/others/refreshInfo";

function AddMeetingFetch() {
  const navigate = useNavigate();
  const { handleCloseCard } = useRefresh();
  const [meeting_name, setMeetingName] = useState("");
  const [meeting_date, setMeetingDate] = useState("");
  const [meeting_time, setMeetingTime] = useState("");
  const [meeting_lieu, setMeetingLieu] = useState("");
  const [selectedParticipantsAndTeams, setSelectedParticipantsAndTeams] =
    useState([]);
  const [combinedOptions, setCombinedOptions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // On récupère la liste des utilisateurs
        const usersRes = await axios.get("http://localhost:8000/usersmeeting");
        // On récupère la liste des équipes
        const teamsRes = await axios.get("http://localhost:8000/teams");

        const usersData = usersRes.data.map((user) => ({
          ...user,
          type: "user", // J'ajoute un type pour distinguer les utilisateurs des équipes
          label: `${user.firstname} ${user.lastname}`, // Ce qui va être affiché dans le champ de sélection
        }));

        const teamsData = teamsRes.data.map((team) => ({
          ...team,
          type: "team",
          label: team.team_name,
        }));

        // La je combine les deux listes
        setCombinedOptions([...usersData, ...teamsData]);
      } catch (err) {
        console.error("Erreur lors de la récupération des options:", err);
        setError("Erreur lors du chargement des participants et des équipes.");
        setCombinedOptions([]); // Réinitialiser en cas d'erreur
      }
    };

    fetchOptions();
  }, []);

  const handleCreateMeeting = async (onSuccess) => {
    if (
      !selectedParticipantsAndTeams ||
      selectedParticipantsAndTeams.length === 0
    ) {
      setError("Veuillez sélectionner au moins un participant ou une équipe.");
      return;
    }

    // La je sépare les participants et les équipes
    const participants = selectedParticipantsAndTeams
      .filter((item) => item.type === "user")
      .map((user) => ({ firstname: user.firstname, lastname: user.lastname }));

    const teamIds = selectedParticipantsAndTeams
      .filter((item) => item.type === "team")
      .map((team) => team.team_id);

    if (participants.length === 0 && teamIds.length === 0) {
      setError(
        "Veuillez sélectionner au moins un participant ou une équipe valide."
      );
      return;
    }

    const currentToken = localStorage.getItem("token");
    let createdby = null;

    if (currentToken) {
      const decodedToken = jwtDecode(currentToken);

      createdby = {
        firstname: decodedToken.firstname,
        lastname: decodedToken.lastname,
      };
    } else {
      setError("Utilisateur non authentifié");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/add-meeting", {
        meeting_name,
        meeting_date,
        meeting_time,
        meeting_lieu,
        participants,
        teams: teamIds,
        createdby,
      });

      console.log("Création réussie", response.data);

      handleCloseCard();
      if (onSuccess) onSuccess();
      navigate("/meeting");
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.status === 400) {
          setError(
            "Tous les champs requis (nom, lieu, date, heure, créateur) doivent être remplis, et au moins un participant ou une équipe doit être sélectionné."
          );
        } else if (error.response.status === 404) {
          setError("Créateur non trouvé.");
        } else {
          setError(
            error.response.data.message ||
              "Erreur lors de la création de la réunion."
          );
        }
      } else {
        setError("Erreur serveur lors de la création de la réunion.");
      }
    }
  };

  return {
    meeting_name,
    setMeetingName,
    meeting_date,
    setMeetingDate,
    meeting_time,
    setMeetingTime,
    meeting_lieu,
    setMeetingLieu,
    selectedParticipantsAndTeams,
    setSelectedParticipantsAndTeams,
    combinedOptions,
    handleCreateMeeting,
    error,
  };
}

export default AddMeetingFetch;
