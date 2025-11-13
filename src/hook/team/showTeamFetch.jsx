import axios from "axios";
import { useCallback, useEffect, useState } from "react";

function ShowTeamFetch() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const showTeams = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8001/teams");
      setLoading(false);
      setTeams(response.data);
      console.log(response.data);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        if (error.response.status === 404) {
          setError("Aucune équipe trouvée");
        }
      } else {
        setError("Erreur serveur");
      }
    }
  }, []);

  useEffect(() => {
    showTeams();
  }, [showTeams]);

  return {
    teams,
    setTeams,
    loading,
    error,
    showTeams,
  };
}

export default ShowTeamFetch;
