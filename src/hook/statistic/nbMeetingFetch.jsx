import axios from "axios";
import { useEffect, useState } from "react";

function NbMeetingFetch() {
  const [nbMeeting, setNbMeeting] = useState([]);
  const [rateMeetings, setRateMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDateNbMeeting = async () => {
      try {
        const response = await axios.get(
          "https://reunigo.onrender.com/nb-meetings"
        );
        setNbMeeting(response.data.meetingStats);
        setRateMeetings(response.data.participationStats);
        setLoading(false);
        console.log("response", response.data.meetingStats);
        console.log(
          "response participationStats",
          response.data.participationStats
        );
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
        setError("Erreur lors de la récupération des données");
        setLoading(false);
      }
    };
    fetchDateNbMeeting();
  }, []);

  return {
    nbMeeting,
    rateMeetings,
    loading,
    error,
  };
}

export default NbMeetingFetch;
