import axios from "axios";
import jwtDecode from "jwt-decode";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRefresh } from "../../components/others/refreshInfo";

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
  const [file, setFile] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const usersRes = await axios.get("http://localhost:8001/usersmeeting");
        const teamsRes = await axios.get("http://localhost:8001/teams");

        const usersData = usersRes.data.map((user) => ({
          ...user,
          type: "user",
          label: `${user.firstname} ${user.lastname}`,
        }));

        const teamsData = teamsRes.data.map((team) => ({
          ...team,
          type: "team",
          label: team.team_name,
        }));

        setCombinedOptions([...usersData, ...teamsData]);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des participants et des équipes:",
          error
        );
        setError("Erreur lors du chargement des participants et des équipes.");
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

    const participants = selectedParticipantsAndTeams
      .filter((item) => item.type === "user")
      .map((user) => ({ firstname: user.firstname, lastname: user.lastname }));
    const teamIds = selectedParticipantsAndTeams
      .filter((item) => item.type === "team")
      .map((team) => team.team_id);

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

    const formData = new FormData();
    formData.append("meeting_name", meeting_name);
    formData.append("meeting_date", meeting_date);
    formData.append("meeting_time", meeting_time);
    formData.append("meeting_lieu", meeting_lieu);
    formData.append("createdby", JSON.stringify(createdby));
    formData.append("participants", JSON.stringify(participants));
    formData.append("teams", JSON.stringify(teamIds));

    if (file && file.length > 0) {
      file.forEach((f) => formData.append("files", f));
    }

    try {
      const response = await axios.post(
        "http://localhost:8001/add-meeting",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(response.data);
      handleCloseCard();
      if (onSuccess) onSuccess();
      navigate("/meeting");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur lors de la création de la réunion."
      );
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
    file,
    setFile,
    handleCreateMeeting,
    error,
  };
}

export default AddMeetingFetch;
