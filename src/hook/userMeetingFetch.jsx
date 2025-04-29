import axios from "axios";
import { useCallback, useEffect, useState } from "react";

function UserMeetingFetch(initialMeetingId = null) {
  const [userMeeting, setUserMeeting] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentMeetingId, setCurrentMeetingId] = useState(initialMeetingId);

  useEffect(() => {
    setCurrentMeetingId(initialMeetingId);
  }, [initialMeetingId]);

  const showUserMeeting = useCallback(
    async (meetingIdToFetch) => {
      const idToFetch = meetingIdToFetch || currentMeetingId;
      if (!idToFetch) {
        setError("L'id de la réunion n'est pas défini");
        return;
      }
      setLoading(true);

      try {
        console.log("ID de la réunion pour la requête : ", idToFetch);

        const response = await axios.get(
          `http://localhost:8000/users-meeting/${idToFetch}`
        );
        setUserMeeting(response.data);
        setLoading(false);
        console.log("Réponse de l'api : ", response.data);
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.data) {
          if (error.response.status === 500) {
            // Correction de "statut" en "status"
            setError("Erreur interne du serveur");
          } else {
            setError(
              error.response.data.message ||
                "Erreur lors de la récupération des participants"
            );
          }
        } else {
          setError("Erreur serveur");
        }
      }
    },
    [currentMeetingId]
  );

  useEffect(() => {
    showUserMeeting(currentMeetingId);
  }, [showUserMeeting, currentMeetingId]);

  return {
    userMeeting,
    loading,
    error,
    showUserMeeting,
  };
}

export default UserMeetingFetch;
