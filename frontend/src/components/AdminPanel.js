
import { Link,useNavigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import { useEffect, useState } from 'react';


import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; 
export default function AdminPanel() {


    const [adminName, setAdminName] = useState(""); // State to hold seller's name

    const navigate = useNavigate();


    useEffect(() => {
      const fetchSellerName = async () => {
          const token = localStorage.getItem('authToken');
          if (!token) {
            
              navigate('/AdminLogin'); // Redirect if not logged in
              alert("only have access to admins");
              return;
          }
          try {
              const { id } = jwtDecode(token);
              const response = await axios.get('http://localhost:8070/admin/me', {
                  headers: { 'authToken': token }
              });
              setAdminName(response.data.name);
          } catch (error) {
              console.error("Failed to fetch admin data:", error);
              navigate('/AdminLogin'); // Redirect on error
          }
      };
      fetchSellerName();
  }, [navigate]);


    return (
        <div className="container mt-5 mb-5">
            <h1 className="mb-4 text-center">Admin Panel</h1>
            <br></br>
            <br></br>
            

            {adminName && <span style={{ color: "black", marginRight: "15px" ,fontSize:"34"}}>{`Welcome, ${adminName}`}</span>}
            <br></br>
            <br></br>
            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Item Management</h5>
                            <p className="card-text">Manage your items here. You can add, edit, or delete items.</p>
                            <Link to="/Admin/items" className="btn btn-dark">Go to Item Management</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Auction Management</h5>
                            <p className="card-text">Manage your auctions here. You can create, edit, or delete auctions.</p>
                            <Link to="/AuctionManagement" className="btn btn-dark">Go to Auction Management</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Seller Management</h5>
                            <p className="card-text">Manage sellers here. You can view or manage seller profiles.</p>
                            <Link to="/Admin/sellers" className="btn btn-dark">Go to Seller Management</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Bidder Management</h5>
                            <p className="card-text">Manage bidders here. You can view or manage bidder profiles.</p>
                            <Link to="/Admin/bidders" className="btn btn-dark">Go to Bidder Management</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Employee Management</h5>
                            <p className="card-text">Manage Employees here. You can view or manage Employee profiles and salary.</p>
                            <Link to="/Employee" className="btn btn-dark">Go to Employee Registration</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Seating Management</h5>
                            <p className="card-text">Manage  Seating here. You can view or manage Seating arrangements.</p>
                            <Link to="/AssignSeats" className="btn btn-dark">Go to Employee Registration</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Advertiesment Management</h5>
                            <p className="card-text"><p>Manage  Advertiesment here. You can view or manage Advertiesment.</p></p>
                            <Link to="/mainDashboard" className="btn btn-dark">go to Advertising</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Delivery Management</h5>
                            <p className="card-text">delivery  Management here. You can view or manage delivery.</p>
                            <Link to="/deliveryboy" className="btn btn-dark">go to delivery</Link>
                        </div>
                    </div>
                    
                    
                </div>
              




            </div>
            
            
        </div>
    );
}
