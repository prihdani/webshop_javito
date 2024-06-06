import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import '../components/css/Profile.css';
import { useAuth } from "./AuthContext";

interface UserData {
  lastName: string;
  firstName: string;
  email: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("http://localhost:5000/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });

      if (response.status === 401) {
        navigate("/bejelentkezes");
        return;
      }

      const userData: UserData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Felhasználói adatok lekérése hiba:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
    } catch (error) {
      console.error("Kijelentkezés hiba:", error);
    } finally {
      localStorage.removeItem("accessToken");
      logout(); 
      navigate("/bejelentkezes", { replace: true }); 
    }
  };

  return (
    <div className="background">
      <div className="container">
        <h3 className="login-title">Felhasználói adatok</h3>
        <div className="user-info">
          <p>Email: {user?.email}</p>
          <p>Vezetéknév: {user?.lastName}</p>
          <p>Keresztnév: {user?.firstName}</p>
          <div className="button-container">
            <button className="logout-button" onClick={handleLogout}>Kijelentkezés</button>
            <NavLink className="link" to="/update">Adatok módosítása</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
