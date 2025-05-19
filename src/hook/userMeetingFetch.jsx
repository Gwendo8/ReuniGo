import axios from "axios";
import { useCallback, useEffect, useState } from "react";

function UserMeetingFetch(initialMeetingId = null) {
  const [userMeeting, setUserMeeting] = useState([]);
  const [files, setFiles] = useState([]);
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
        const filesResponse = await axios.get(
          `http://localhost:8000/files-meeting/${idToFetch}`
        );
        setUserMeeting(response.data);
        setFiles(filesResponse.data);
        setLoading(false);
        console.log("Réponse de l'api : ", response.data);
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.data) {
          if (error.response.status === 500) {
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

  const updateUserPresence = async (userId, isPresent) => {
    // si currentMeetingId n'est pas défini ce qui veut dire qu'il est undefined ou null
    // alors on quitte directement la fonction
    if (!currentMeetingId) return;

    try {
      const response = await axios.patch(
        `http://localhost:8000/users-meeting/${currentMeetingId}/${userId}`, // on a l'id de la réunion et l'id du participant dont on veut changer la présence
        // la j'envoie un objet JSON avec une seule clé et sa valeur qui est un booléen
        // donc ici la présence de l'utilisateur à la réunion
        { is_present: isPresent }
      );
      // la je met à jour localement la présence de l'utilisateur dans la réunion
      // prev va permettre d'accéder à l'état précédent
      setUserMeeting((prev) =>
        // donc la je parcours chaque réunions dans l'état
        prev.map((meeting) => {
          // si la réunion a des participants
          if (meeting.participants) {
            // je créer une variable qui va stocker une nouvelle liste de participants avec modification
            const updatedParticipants = meeting.participants.map(
              (participant) =>
                // si l'id du participant correspond à celui qu'on modifie
                participant.id === userId
                  ? // je créer une copie du participant mais en mettant à jour son statut de présence
                    { ...participant, present: isPresent }
                  : // sinon je laisse le participant tel quel
                    participant
            );
            // c'est ici que je créer la copie avec les participants mis à jour
            return { ...meeting, participants: updatedParticipants };
          }
          return meeting;
        })
      );

      console.log("Mise à jour de la présence : ", response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.status === 404) {
          setError("Utilisateur ou réunion non trouvée");
        }
      } else {
        setError("Erreur serveur");
      }
    }
  };

  useEffect(() => {
    showUserMeeting(currentMeetingId);
  }, [showUserMeeting, currentMeetingId]);

  return {
    userMeeting,
    files,
    loading,
    error,
    showUserMeeting,
    updateUserPresence,
  };
}

export default UserMeetingFetch;
