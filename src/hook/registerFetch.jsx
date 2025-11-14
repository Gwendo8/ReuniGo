import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterFetch() {
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [mail, setMail] = useState("");
  const [sgid, setSgid] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError(
        "Le mot de passe et la confirmation de mot de passe sont différent"
      );
      return;
    }
    try {
      const response = await axios.post(
        "https://reunigo.onrender.com/register",
        {
          firstname,
          lastname,
          mail,
          sgid,
          password,
          confirmPassword,
        }
      );
      console.log("Connexion réussi", response.data);
      navigate("/login"); // ✅ redirection
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.status === 400) {
          setError("Tous les champs doivent être rempli");
        } else if (error.response.status === 401) {
          setError("L'email est déjà utilisé");
        } else {
          setError("Erreur lors de la connexion");
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
    mail,
    setMail,
    sgid,
    setSgid,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    handleRegister,
  };
}

export default RegisterFetch;
