import axios from "axios";
import { useEffect, useState } from "react";
import { useRefresh } from "../components/others/refreshInfo";

// je met un paramètre user
// pour quand je vais appeler ce hook lui passer les informations de l'utilisateur
function UpdateProfilUserFetch({ user }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // le ? permet de vérifier que user existe avant d'accéder à ses propriétés
  // sinon on initialise les états avec une chaîne vide pour éviter les erreurs
  const [firstname, setFirstname] = useState(user?.firstname || "");
  const [lastname, setLastname] = useState(user?.lastname || "");
  const [mail, setMail] = useState(user?.mail || "");
  const [password, setPassword] = useState("");
  // J'importe la fonction handleCloseCard depuis le hook useRefresh
  // qui permet de rafraîchir l'interface après la mise à jour du profil
  // et de fermer le formulaire après la mise à jour du profil
  const { handleCloseCard } = useRefresh();

  // ce useEffect va se déclencher à chaque fois que le user change
  // et va permettre de mettre à jour les champs du formulaire avec les nouvelles valeurs reçues
  // sauf pour le mot de passe qui va rester vide dans tous les cas à l'affichage
  useEffect(() => {
    if (user) {
      setFirstname(user.firstname || "");
      setLastname(user.lastname || "");
      setMail(user.mail || "");
      setPassword("");
    }
  }, [user]);

  // cette fonction va permettre de mettre à jour le profil de l'utilisateur
  // en prenant en paramètre l'id de l'utilisateur et les données modifiées
  const updateProfilUser = async (id, firstname, lastname, mail, password) => {
    if (!id) {
      setError("L'id de l'utilisateur n'est pas défini");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:8000/update-user-info/${id}`,
        {
          firstname,
          lastname,
          mail,
          password,
        }
      );
      console.log("Profil utilisateur mis à jour : ", response.data);
      // si la réponse contient un nouveau token, on le stocke dans le localStorage
      // sa c'est pour permettre de mettre à jour les informations de l'utilisateur directement sans devoir se déconnecter
      const newToken = response.data.token;
      if (newToken) {
        localStorage.setItem("token", newToken);
      }
      // Déclenche le rafraîchissement de l'interface
      // ce qui va permettre de voir les nouvelles informations de l'utilisateur
      // dans la navbar et le menu coulissant sans devoir recharger la page
      // et permet de fermer la pop up en même temps
      handleCloseCard();
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        if (error.response.status === 404) {
          setError("Utilisateur non trouvé");
        } else {
          setError(
            error.response.data.message ||
              "Erreur lors de la mise à jour du profil utilisateur"
          );
        }
      } else {
        setError("Erreur lors de la mise à jour du profil utilisateur");
      }
      throw error;
    }
  };

  return {
    updateProfilUser,
    firstname,
    setFirstname,
    lastname,
    setLastname,
    mail,
    setMail,
    password,
    setPassword,
    error,
    loading,
  };
}

export default UpdateProfilUserFetch;
