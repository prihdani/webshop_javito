import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import Registration from "./pages/Registration";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.css";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProfileChange from "./pages/DataChange";
import ProductList from "./pages/productList";
import SEARCHPAGE from './pages/searchPage';
import PRODUCTPAGE from './pages/productPage';
import { AuthProvider } from "./pages/AuthContext"; 


function App() {
  const navItems = ["Home", "Regisztráció", "Bejelentkezés"];

  return (
    <AuthProvider>
    <Router>
       <NavBar brandName={"Webshop"} items={navItems} />
      <Routes>
        <Route path="/regisztracio" element={<Registration />} />
        <Route path="/" element={<Home />} />
        <Route path="/update" element={<ProfileChange />} />
        <Route path="/products/categories" element={<ProductList />} />
        <Route path="/profil" element={<Profile />} />
        <Route path="/bejelentkezes" element={<Login />} />
        <Route path="/search" element={<SEARCHPAGE />} />
        <Route path='/search/:params' element={<SEARCHPAGE />}></Route>
        <Route path='/product/:productId' element={<PRODUCTPAGE />} />
      </Routes>
    </Router>
    </AuthProvider>

  );
}

export default App;
