import { useState } from "react";
import axios from "axios"; // Tu avais oublié d'importer axios
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode"; // ✅ import

function LoginFetch() {
  const navigate = useNavigate();

  const [sgid, setSgid] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    console.log("Tentative de connexion avec", sgid, password);
    try {
      const response = await axios.post("https://reunigo.onrender.com/login", {
        sgid,
        password,
      });
      // donc la je récupère le token que j'ai crée dans le back
      // et je lui met la réponse de la requête http
      const { token } = response.data;
      // la je décode le token pour pouvoir lire les informations qu'il y'a à l'intérieur
      const decoded = jwtDecode(token);
      // et la je récupère le role de l'utilisateur connnecté
      const role = decoded.rolename;
      const id = decoded.id;
      // ensuite je stock le token dans un localStorage
      // le localStorage permet de conserver les données de l'utilisateur même si la page est raffraichi ou fermer
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("id", id);
      console.log("Token stocké dans le localStorage", id);
      // redirection par rapport au rôle
      if (role === "ADMIN") {
        navigate("/admin");
      } else navigate("/meeting");
    } catch (error) {
      // Vérifie si la réponse d'erreur contient des données
      if (error.response && error.response.data) {
        // Si le statut est 404 ou 401, erreur d'identifiant ou de mot de passe
        if (error.response.status === 404 || error.response.status === 401) {
          setError("Identifiant ou mot de passe invalide");
        }
      } else {
        // Si la réponse d'erreur ne contient pas de données, erreur lors de la connexion
        setError("Erreur lors de la connexion");
      }
      // Si l'erreur n'a pas de réponse (erreur réseau ou autre)
      if (!error.response) {
        setError("Erreur serveur");
      }
    }
  };

  return {
    sgid: sgid,
    setSgid: setSgid,
    password: password,
    setPassword: setPassword,
    error: error,
    handleLogin: handleLogin,
  };
}

export default LoginFetch;
