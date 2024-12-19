import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "../../RegisterAuctionSeller.css";
import { useNavigate } from "react-router-dom";

export default function RegisterToAuctionAsBidder() {
  const [bidderData, setBidderData] = useState(null);
  const { id } = useParams(); // Extract auction ID from URL
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 


  
  useEffect(() => {
    axios
      .get(`http://localhost:8070/auction/${id}`)
      .then((response) => {
        setAuction(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching auction:", error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios
        .get("http://localhost:8070/bidder/me", {
          headers: { authToken: token },
        })
        .then((response) => {
          if (response.data) setBidderData(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the bidder data!", error);
        });
    } else {
      console.error("No token found");
    }
  }, []);

  if (loading) return <p>Loading auction details...</p>;
  if (!auction) return <p>Auction not found.</p>;

  const handleRegisterAuction = () => {
    axios
      .post("http://localhost:8070/auction/registerAsBidder", {
        auctionId: auction._id,
        userId: bidderData._id, 
      })
      .then(() => {
        alert("Registered for the auction successfully");
        navigate("/ItemListView"); // Navigate to ItemListView on success
      })
      .catch((err) => {
        alert("already  registered for this auction");
        navigate("/ItemListView");

      });
  };

  return (
    <div className="auction-container">
      <div className="register-header">
        <h2>Register To Auction</h2>
      </div>
      <div className="auction-form-container">
        <div className="personal-details">
          <h4>Personal details :</h4>
          <form>
            <div className="form-group">
              <label>Name :</label>
              <input
                type="text"
                className="form-control"
                value={
                  bidderData
                    ? `${bidderData.firstName} ${bidderData.lastName}`
                    : ""
                }
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Email :</label>
              <input
                type="email"
                className="form-control"
                value={bidderData ? bidderData.email : ""}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Address :</label>
              <input
                type="text"
                className="form-control"
                value={bidderData ? bidderData.address : ""}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Phone Number :</label>
              <input
                type="text"
                className="form-control"
                value={bidderData ? bidderData.contactInfo : ""}
                readOnly
              />
            </div>
          </form>
        </div>
        <div className="auction-details">
          <h4>Auction details :</h4>
          <form>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Title:</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={auction.title}
                  onChange={(e) =>
                    setAuction({ ...auction, title: e.target.value })
                  }
                  readOnly
                />
              </div>
              <div className="form-group col-md-6">
                <label>Location:</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={auction.location}
                  onChange={(e) =>
                    setAuction({ ...auction, location: e.target.value })
                  }
                  readOnly
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Date:</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={auction.date}
                  onChange={(e) =>
                    setAuction({ ...auction, date: e.target.value })
                  }
                  readOnly
                />
              </div>
              <div className="form-group col-md-6">
                <label>Category:</label>
                <input
                  type="text"
                  className="form-control"
                  name="category"
                  value={auction.category}
                  onChange={(e) =>
                    setAuction({ ...auction, category: e.target.value })
                  }
                  readOnly
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="button-group">
        <Link to={`/RegisterToAuction/${auction._id}`} style={{ color: "white", textDecoration: "none" }}>
          <button className="btn btn-danger">Exit</button>
        </Link>
        
          
        <div>
        
          <button
          className="btn btn-secondary btn-lg"
          onClick={handleRegisterAuction}
          
        >
          Register
        </button>

       </div>
        
      </div>
    </div>
  );
}
