import { useState } from "react";
import { useRefresh } from "../../components/others/refreshInfo";
import axios from "axios";
import { API } from "../../api";

function DeleteTeamFetch() {
  const { handleCloseCard } = useRefresh();
  const [errorDelete, setErrorDelete] = useState("");

  const deleteTeam = async (id, onSuccess) => {
    if (!id) {
      setErrorDelete("ID d'équipe manquant");
      return;
    }

    try {
      const response = await axios.delete(`${API}/delete-team/${id}`);
      console.log("Suppression réussie", response.data);
      handleCloseCard();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.status === 404) {
          setErrorDelete("Équipe non trouvée");
        } else if (error.response.status === 400) {
          setErrorDelete("ID d'équipe invalide");
        } else {
          setErrorDelete("Erreur lors de la suppression");
        }
      } else {
        setErrorDelete("Erreur serveur");
      }
    }
  };

  return {
    errorDelete,
    deleteTeam,
  };
}

export default DeleteTeamFetch;
