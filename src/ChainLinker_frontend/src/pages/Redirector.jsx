import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOriginalUrl } from "../services/api";

const Redirector = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getOriginalUrl(id).then((url) => {
        if (url) window.location.href = url;
        else navigate("/");
      });
    }
  }, []);

  return <p>Redirecting...</p>;
};

export default Redirector;
