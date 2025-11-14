import axios from "axios";
import { useEffect, useState } from "react";

function UserTopAbsenceFetch() {
  const [topAbsence, setTopAbsence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataTopAbsence = async () => {
      try {
        const response = await axios.get(
          "https://reunigo.onrender.com/users-top-absences"
        );
        setLoading(false);
        setTopAbsence(response.data);
        console.log(response.data);
      } catch (error) {
        setLoading(false);
        console.error("Erreur lors du chargement des utilisateurs", error);
        setError("Erreur lors du chargement");
      }
    };
    fetchDataTopAbsence();
  }, []);
  return {
    topAbsence,
    loading,
    error,
  };
}

export default UserTopAbsenceFetch;
