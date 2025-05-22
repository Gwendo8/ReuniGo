import axios from "axios";
import { useState } from "react";
import { useRefresh } from "../../components/others/refreshInfo";
import jwtDecode from "jwt-decode";

function UpdateUserFetch(onSuccess) {
  // je récupère la fonction handleCloseCard du composant useRefresh
  // cette fonction va permettre de déclencher le raffraichissement
  const { handleCloseCard } = useRefresh();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [idrole, setIdRole] = useState("");
  const [error, setError] = useState("");
  const [id, setId] = useState("");

  const updateUser = async () => {
    if (!id) {
      setError("L'id de l'utilisateur n'est pas défini");
      return;
    }

    if (!idrole) {
      setError("Le rôle de l'utilisateur est requis");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8000/admin-update/${id}`,
        {
          firstname,
          lastname,
          mail,
          idrole,
          password,
        }
      );
      console.log("Modification réussie", response.data);

      // je récupère le token actuel stocké dans le localStorage
      const currentToken = localStorage.getItem("token");
      // si un token existe (donc si un utilisateur est connecté)
      if (currentToken) {
        // on décode le token pour avoir les informations de l'utilisateur connecté
        const decodedToken = jwtDecode(currentToken);
        // je vérifie si l'utilisateur que la personne vient de modifié est l'utilisateur connecté
        if (decodedToken.sgid === id) {
          // Si c'est le cas, on récupère le nouveau token de la réponse
          const newToken = response.data.token;
          // si un nouveau token à été envoyé
          if (newToken) {
            // on met à jour le token dans le localStorage
            localStorage.setItem("token", newToken);
          }
        }
      }

      // on appelle handleCloseCard pour déclencher le raffraichissement
      handleCloseCard();
      // si une fonction de succès à été passé en paramètre, on l'appelle
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.status === 404) {
          setError("Utilisateur non trouvé");
        }
      } else {
        setError("Erreur serveur");
      }
    }
  };
  return {
    firstname,
    setFirstname,
    lastname,
    setLastname,
    password,
    setPassword,
    mail,
    setMail,
    idrole,
    setIdRole,
    error,
    updateUser,
    setId,
  };
}

export default UpdateUserFetch;
