import axios from "axios";
import { useEffect, useState, useCallback } from "react";

function MeetingFetch() {
  const [meeting, setMeeting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const userId = localStorage.getItem("id");
      const role = localStorage.getItem("role");
      const response = await axios.get(
        `https://reunigo.onrender.com/meetings?id=${userId}&role=${role}`
      );
      setMeeting(response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.status === 500) {
          setError("Une erreur est survenue");
        }
      } else {
        setError("Erreur serveur");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    meeting,
    loading,
    error,
    fetchData,
  };
}

export default MeetingFetch;
