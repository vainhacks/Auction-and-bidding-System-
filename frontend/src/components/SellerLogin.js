import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SellerLogin() {
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      const response = await axios.post("http://localhost:8070/seller/login", { username, password });
      localStorage.setItem("authToken", response.data.token); // Save token
      navigate("/ItemListView"); // Redirect to seller dashboard
    }  catch (err) {
      console.error(err.response || err.message); // Log the entire error
      if (err.response && err.response.status === 400) {
        setError("Invalid credentials. Please try again.");
      } else {
        setError("Server error. Please try again later.");
      }
    }
    
  };

  return (
    <div className="login-container">
      <div className="card shadow-sm" style={{ backgroundColor: "#EEDF7A" }}>
        <div className="card-body">
          <div className="text-center mb-4">
            <img
              src="/Assests/bid-master-logo-zip-file/png/logo-white.png"
              alt="Company Logo"
              className="img-fluid"
              style={styles.logo}
            />
          </div>
          <h2 className="text-center mb-4">Seller Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              className="btn btn-outline-dark me-2"
              type="submit"
              style={{ width: 150, height: 50 }}
            >
              Login
            </button>
          </form>
          <div className="links mt-3">
            <a href="/signup" className="link">
              Don't have an account?
            </a>
            <br />
            <a href="/seller" className="link ml-3">
              Seller?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styling for the logo
const styles = {
  logo: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    border: "5px solid #000",
    boxShadow: "0px"
  }}