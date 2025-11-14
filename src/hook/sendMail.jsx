import axios from "axios";
import { useState } from "react";

function SendMail() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [submitStatus, setSubmitStatus] = useState(null);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://reunigo.onrender.com/send-email", form);
      setSubmitStatus("success");
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus("error");
      if (error.response && error.response.data) {
        if (error.response.status === 400) {
          setError(error.response.data.message);
        } else if (error.response.status === 401) {
          setError(error.response.data.message);
        } else {
          setError("Erreur lors de l’envoi");
        }
      }
    }
  };
  return {
    form,
    handleChange,
    handleSubmit,
    submitStatus,
    error,
  };
}

export default SendMail;
