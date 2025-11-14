import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../api";

function UserPresenceFetch() {
  const [userPresence, setUserPresence] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}/users-presence`);
        setUserPresence(response.data.users);
        setTotalUsers(response.data.total_guest_users);
      } catch (err) {
        console.error("Erreur lors du chargement des utilisateurs", err);
        setError("Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    userPresence,
    totalUsers,
    loading,
    error,
  };
}

export default UserPresenceFetch;
