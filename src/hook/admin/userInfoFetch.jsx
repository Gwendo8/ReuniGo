import axios from "axios";
import { useEffect, useState } from "react";
import { API } from "../../api";

function UserInfoFetch(refreshInfo) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API}/users`)
      .then((response) => setData(response.data))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [refreshInfo]);

  return {
    data: data,
    loading: loading,
    error: error,
  };
}

export default UserInfoFetch;
