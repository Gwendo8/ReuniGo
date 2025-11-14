import axios from "axios";
import { useState } from "react";

function ShowInfosTeamFetch() {
  const [infoTeam, setInfoTeam] = useState([]);
  const [error, setError] = useState("");

  const showInfoTeam = async (teamId) => {
    try {
      const response = await axios.get(
        `https://reunigo.onrender.com/teams/${teamId}`
      );
      setInfoTeam(response.data);
      console.log("reponse du click sur une équipe : ", response.data);
    } catch (error) {
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
    infoTeam,
    error,
    showInfoTeam,
  };
}

export default ShowInfosTeamFetch;
