import { useEffect, useState } from "react";
import { API } from "../api";

function RoleFetch() {
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${API}/roles`);
        const data = await response.json();
        setRole(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des rôles :", error);
        setError("Erreur lors du chargement des rôles");
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);
  return {
    roleInfo: role,
    errorInfo: error,
    loading,
  };
}

export default RoleFetch;
