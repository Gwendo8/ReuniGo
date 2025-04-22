import axios from "axios";
import { useEffect, useState } from "react";

function MeetingFetch() {
  const [meeting, setMeeting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("id");
        const response = await axios.get(
          `http://localhost:8000/meetings?id=${userId}`
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
    };

    fetchData();
  }, []);

  return {
    meeting,
    loading,
    error,
  };
}

export default MeetingFetch;
