import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../pages/AuthContext';
import '../components/css/style.css';

interface NavBarProps {
    brandName: string;
    items: string[];
}

const NavBar: React.FC<NavBarProps> = ({ brandName, items }) => {
    const { isLoggedIn } = useAuth();
    const [query, setQuery] = useState<string>('');
    const navigate = useNavigate();
    const search = (event: React.FormEvent) => {
        event.preventDefault();
        navigate('/search/query=' + query);
        setQuery('');
    }

    return (
        <nav className="navbar navbar-expand-md navbar-grey bg-grey shadow">
            <NavLink className="navbar-brand" to="/">
                <span className="fw-bolder fs-4">{brandName}</span>
            </NavLink>
            <div className="navigacio">
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>
                            {item === 'Home' ? (
                                <NavLink to="/">{item}</NavLink>
                            ) : item === 'Keresés' ? (
                                <NavLink to="/search">{item}</NavLink>
                            ) : item === 'Bejelentkezés' && !isLoggedIn ? (
                                <NavLink to="/bejelentkezes">{item}</NavLink>
                            ) : item === 'Regisztráció' && !isLoggedIn ? (
                                <NavLink to="/regisztracio">{item}</NavLink>
                            ) : null}
                        </li>
                    ))}
                </ul>
                <div className="kosar">
                    <NavLink to="/kosar">
                        <FontAwesomeIcon icon={faShoppingBasket} />
                    </NavLink>
                </div>
                {isLoggedIn && (
                    <div className="profil">
                        <NavLink to="/profil">
                            <FontAwesomeIcon icon={faUser} />
                        </NavLink>
                    </div>
                )}
                <form className="search-bar" onSubmit={search}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Keress egy termékre"
                    />
                    <button type="submit">Keresés</button>
                </form>
            </div>
        </nav>
    );
};

export default NavBar;