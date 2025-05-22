import axios from "axios";
import { useState } from "react";
import { useRefresh } from "../../components/others/refreshInfo";

function DeleteUserFetch() {
  const { handleCloseCard } = useRefresh();

  const [errorDelete, setErrorDelete] = useState("");

  const deleteUser = async (sgid, onSucess) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/admin-delete/${sgid}`
      );
      console.log("Suppression réussie", response.data);
      handleCloseCard();
      if (onSucess) {
        onSucess();
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.status === 404) {
          setErrorDelete("Utilisateur non trouvé");
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
    deleteUser,
  };
}

export default DeleteUserFetch;
