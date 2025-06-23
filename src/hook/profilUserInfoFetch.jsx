import axios from "axios";
import { useState, useCallback } from "react";

function ProfilUserInfoFetch() {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUserInfo = useCallback(async (userId) => {
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `http://localhost:8000/user-info/${userId}`
      );
      setUserInfo(response.data);
      console.log("Informations utilisateur récupérées : ", response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.status === 404) {
          setError("Utilisateur non trouvé");
        } else if (error.response.status === 400) {
          setError("Identifiant de l'utilisateur manquant");
        } else {
          setError(
            "Erreur lors de la récupération des informations utilisateur"
          );
        }
      } else {
        setError("Erreur serveur");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    userInfo,
    error,
    loading,
    fetchUserInfo,
  };
}

export default ProfilUserInfoFetch;
