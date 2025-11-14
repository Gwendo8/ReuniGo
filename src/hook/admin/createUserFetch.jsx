import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../../api";

function CreateUserFetch() {
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [mail, setMail] = useState("");
  const [sgid, setSgid] = useState("");
  const [password, setPassword] = useState("");
  const [idrole, setIdRole] = useState("");
  const [error, setError] = useState("");

  const handleCreate = async (onSuccess) => {
    if (!idrole) {
      setError("Le rôle de l'utilisateur est requis");
      return;
    }
    try {
      const response = await axios.post(`${API}/admin-create`, {
        firstname,
        lastname,
        mail,
        sgid,
        idrole,
        password,
      });
      console.log("Création réussie", response.data);
      if (onSuccess) {
        onSuccess();
      }
      navigate("/admin");
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.status === 400) {
          setError("Tous les champs doivent être remplis");
        } else if (error.response.status === 409) {
          setError("Ce SGID est déjà utilisé");
        } else if (error.response.status === 410) {
          setError("Cet email est déjà utilisé");
        } else {
          setError("Erreur lors de la création");
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
    sgid,
    setSgid,
    password,
    setPassword,
    mail,
    setMail,
    idrole,
    setIdRole,
    error,
    handleCreate,
  };
}

export default CreateUserFetch;
