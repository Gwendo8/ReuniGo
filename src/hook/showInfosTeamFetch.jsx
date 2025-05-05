import axios from "axios";
import { useState } from "react";

function ShowInfosTeamFetch() {
  const [infoTeam, setInfoTeam] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const showInfoTeam = async (teamId) => {
    setLoading(true);
    try {
      setLoading(false);
      const response = await axios.get(`http://localhost:8000/teams/${teamId}`);
      setInfoTeam(response.data);
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
    infoTeam,
    error,
    loading,
    showInfoTeam,
  };
}

export default ShowInfosTeamFetch;
