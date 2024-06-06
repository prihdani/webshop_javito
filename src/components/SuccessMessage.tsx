import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  onClose: () => void;
}

const SuccessMessage: React.FC<Props> = ({ onClose }) => {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/bejelentkezes");
  };

  return (
    <div className="overlay">
      <div className="success-message">
        <p>Sikeres Regisztráció!</p>
        <button className="success-button" onClick={handleLoginClick}>
          Bejelentkezés
        </button>
        <button className="success-button" onClick={onClose}>
          Bezárás
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;