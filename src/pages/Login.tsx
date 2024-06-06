import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/css/Login.css";
import { useAuth } from "./AuthContext";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn, login, logout } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/profil");
    }
  }, [isLoggedIn, navigate]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(password);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(username)) {
      setError("Hibás e-mail formátum");
      return;
    }

    if (!validatePassword(password)) {
      setError("A jelszónak legalább 8 karakter hosszúnak kell lennie, és tartalmaznia kell betűket és számokat");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Hibás felhasználónév vagy jelszó");
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      login(); 
      setError(""); 
      navigate("/", { replace: true }); 
    } catch (error) {
      setError("Hibás felhasználónév vagy jelszó, próbálja meg újra");
    }
  };

  return (
    <div className="custom-bg">
      <div className="login-container">
        {isLoggedIn ? (
          <div>
            <h2>Bejelentkezve</h2>
            <button onClick={logout}>Kilépés</button>
          </div>
        ) : (
          <div>
            <h2 className="login-title">Bejelentkezés</h2>
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="username" className="form-label">Email cím:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="form-label">Jelszó:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="submit-button">Bejelentkezés</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;