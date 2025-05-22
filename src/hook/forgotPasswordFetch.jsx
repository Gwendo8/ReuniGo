import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPasswordFetch() {
  const navigate = useNavigate();
  const [mail, setMail] = useState("");
  const [error, setError] = useState("");
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/forgot-password`,
        { mail }
      );
      console.log("Réponse axios :", response.data);
      setSubmitStatus("success");
      setError("");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.log("Erreur axios :", error);
      setSubmitStatus("error");
      if (error.response && error.response.data) {
        if (error.response.status === 400) {
          setError(error.response.data.message);
        } else if (error.response.status === 404) {
          setError(error.response.data.message);
        } else {
          setError("Erreur lors de l’envoi");
        }
      }
    }
  };
  return {
    mail,
    setMail,
    handleSubmit,
    submitStatus,
    error,
  };
}

export default ForgotPasswordFetch;
