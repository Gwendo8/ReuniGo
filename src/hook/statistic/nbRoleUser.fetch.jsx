import axios from "axios";
import { useEffect, useState } from "react";

function NbRoleUserFetch() {
  const [nbRoleUser, setNbRoleUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataNbRoleUser = async () => {
      try {
        const response = await axios.get(
          "https://reunigo.onrender.com/users-nb-roles"
        );
        setLoading(false);
        setNbRoleUser(response.data);
        console.log("nbRoleUser", response.data);
      } catch (error) {
        setLoading(false);
        console.error("Erreur lors du chargement des utilisateurs", error);
        setError("Erreur lors du chargement");
      }
    };
    fetchDataNbRoleUser();
  }, []);

  return {
    nbRoleUser,
    loading,
    error,
  };
}

export default NbRoleUserFetch;
