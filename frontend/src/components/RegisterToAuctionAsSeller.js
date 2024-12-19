import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,Link,useNavigate } from 'react-router-dom';
import '../RegisterAuctionSeller.css';

export default function RegisterToAuctionAsSeller() {
  const [sellerData, setSellerData] = useState(null);
  const { id } = useParams(); // Extract auction ID from URL
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();

  //fetch auction
  useEffect(() => {
    axios.get(`http://localhost:8070/auction/${id}`)
      .then(response => {
        setAuction(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching auction:', error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.get('http://localhost:8070/seller/me', { headers: { 'authToken': token } })
        .then(response => {
          if (response.data) setSellerData(response.data);
          else{
            navigate("/SellerLogin");
          }
        })
        .catch(error => {
          console.error("There was an error fetching the seller data!", error);
        });
    } else {
      console.error("No token found");
    }
  }, []);

  if (loading) return <p>Loading auction details...</p>;
  if (!auction) return <p>Auction not found.</p>;

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
              <input type="text" className="form-control" value={sellerData ? `${sellerData.firstName} ${sellerData.lastName}` : ''} readOnly />
            </div>
            <div className="form-group">
              <label>Email :</label>
              <input type="email" className="form-control" value={sellerData ? sellerData.email : ''} readOnly />
            </div>
            <div className="form-group">
              <label>Address :</label>
              <input type="text" className="form-control" value={sellerData ? sellerData.address : ''} readOnly />
            </div>
            <div className="form-group">
              <label>Phone Number :</label>
              <input type="text" className="form-control" value={sellerData ? sellerData.contactInfo : ''} readOnly />
            </div>
          </form>
        </div>
        <div className="auction-details">
          <h4>Auction details :</h4>
          <form>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Title:</label>
                <input type="text" className="form-control" name="title" value={auction.title} readOnly />
              </div>
              <div className="form-group col-md-6">
                <label>Location:</label>
                <input type="text" className="form-control" name="location" value={auction.location} readOnly />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Date:</label>
                <input type="text" className="form-control" name="date" value={auction.startingDateTime} readOnly />
              </div>
              <div className="form-group col-md-6">
                <label>Category:</label>
                <input type="text" className="form-control" name="category" value={auction.category} readOnly />
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="button-group">
        <button className="btn btn-danger">Exit</button>
        <button className="btn btn-success">

        <Link to={`/AddItems/${id}`} style={{ color: 'white', textDecoration: 'none' }}>
            Next
          </Link>
        </button>
      </div>
    </div>
  );
}
