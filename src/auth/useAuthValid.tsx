import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuthValid = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate('/bejelentkezes');
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          navigate('/bejelentkezes');
        }
      } catch (err) {
        console.error("Error validating token:", err);
        localStorage.removeItem("accessToken");
        navigate('/bejelentkezes');
      }
    };

    validateToken();
  }, [navigate]);
};

export default useAuthValid;
