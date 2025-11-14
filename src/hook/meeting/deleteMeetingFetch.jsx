import { useState } from "react";
import { useRefresh } from "../../components/others/refreshInfo";
import axios from "axios";
import { API } from "../../api";

function DeleteMeetingFetch() {
  const { handleCloseCard } = useRefresh();
  const [errorDelete, setErrorDelete] = useState("");
  const deleteMeeting = async (id, onSucess) => {
    const userId = localStorage.getItem("id");
    const role = localStorage.getItem("role");

    console.log("Tentative de suppression avec :", {
      userId,
      role,
      id,
    });

    try {
      const response = await axios.delete(
        `${API}/delete-meeting/${id}?userId=${userId}&role=${role}`
      );
      console.log("Suppression réussie", response.data);
      handleCloseCard();
      if (onSucess) {
        onSucess();
      }
    } catch (error) {
      console.log("Erreur complète :", error);
      if (error.response && error.response.data) {
        if (error.response.status === 404) {
          setErrorDelete("Réunion non trouvée");
        } else if (error.response.status === 403) {
          setErrorDelete("Vous n'êtes pas autorisé à supprimer cette réunion");
        } else {
          setErrorDelete("Erreur lors de la suppression");
        }
      } else {
        setErrorDelete("Erreur serveur");
      }
    }
  };
  return { deleteMeeting, errorDelete };
}

export default DeleteMeetingFetch;
