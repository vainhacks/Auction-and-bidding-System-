import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function AdminLogin(){

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


    

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      const response = await axios.post("http://localhost:8070/admin/login", { username, password });
      localStorage.setItem("authToken", response.data.token); // Save token
      navigate("/Admin"); // Redirect to seller dashboard
    }  catch (err) {
      console.error(err.response || err.message); // Log the entire error
      if (err.response && err.response.status === 400) {
        setError("Invalid credentials. Please try again.");
      } else {
        setError("Server error. Please try again later.");
      }
    }
    
  };

    return(

        <div className="login-container">
      <div className="card shadow-sm">
        <div className="card-body">
        <div className="text-center mb-4">
            <img
              src="/Assests/bid-master-logo-zip-file/png/logo-white.png"
              alt="Company Logo"
              className="img-fluid"
              style={styles.logo}
            />
          </div>

          <h2 className="text-center mb-4">Admin Login</h2>
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
            
            <a href="/Login" className="link ml-3">Bidder?</a><br></br>
            <a href="/SellerLogin" className="link ml-3">Seller?</a>
            
          </div>
        </div>
      </div>
    </div>
  );

    
}

const styles = {

    logo: {

        width: '150px',
        height: '150px',
        borderRadius: '50%', // Makes the image round
        border: '5px solid #00000', // Adds a border around the image
        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.3)', // Adds shadow for depth
        objectFit: 'cover', // Ensures the image covers the area without distortion

      },
}