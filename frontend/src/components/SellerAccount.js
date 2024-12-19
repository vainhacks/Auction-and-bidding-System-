import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Nav, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale, // Import LinearScale for Bar charts
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import jsPDF from "jspdf";
import "jspdf-autotable"; // Import for table generation

// Register the elements
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);


export default function SellerAccount() {
  const [activeTab, setActiveTab] = useState("personal-details");
  const [sellerData, setSellerData] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate(); // Hook for navigation

  const [registeredAuctions, setRegisteredAuctions] = useState([]);
  const [mostRegisteredAuctions, setMostRegisteredAuctions] = useState([]);

  const [auctionBidderData, setAuctionBidderData] = useState([]);
  
  useEffect(() => {
    axios
      .get("http://localhost:8070/auction/most-registered")
      .then((response) => {
        setMostRegisteredAuctions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching most registered auctions", error);
      });
  }, []);
  
  
  // Fetch the number of bidders for each auction
  useEffect(() => {
    axios
      .get("http://localhost:8070/auction/registered-bidders-count")
      .then((response) => {
        setAuctionBidderData(response.data); // Store the bidder data for the bar chart
      })
      .catch((error) => {
        console.error("Error fetching registered bidder data", error);
      });
  }, []);

  const bidderChartData = {
    labels: auctionBidderData.map((auction) => auction.title), // Auction names
    datasets: [
        {
            label: "Number of Bidders",
            data: auctionBidderData.map((auction) => auction.bidderCount || 0), // Ensure it handles undefined counts
            backgroundColor: "rgba(75, 192, 192, 0.6)", // Bar color
        },
    ],
};

  
  
 

  // const [mostAvailableCategory, setMostAvailableCategory] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  // useEffect(() => {

  //     axios.get('http://localhost:8070/item/analytics/most-available-category')
  //         .then(response => {
  //             setMostAvailableCategory(response.data);
  //         })
  //         .catch(error => {
  //             console.error("Error fetching most available category", error);
  //         });
  // }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8070/item/analytics/categories")
      .then((response) => {
        setCategoryData(response.data); // Store the category data for the pie chart
      })
      .catch((error) => {
        console.error("Error fetching category data", error);
      });
  }, []);

  const chartData = {
    labels: categoryData.map((cat) => cat._id), // Category names
    datasets: [
      {
        data: categoryData.map((cat) => cat.count), // Counts
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          // Add more colors if needed
        ],
      },
    ],
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios
        .get("http://localhost:8070/seller/me", {
          headers: { authToken: token },
        })
        .then((response) => {
          if (response.data) {
            setSellerData(response.data);
            setFormData(response.data);
            fetchRegisteredAuctions(response.data._id); // Fetch auctions for this seller
          }
        })
        .catch((error) => {
          console.error("There was an error fetching the seller data!", error);
        });
    } else {
      console.error("No token found");
    }
  }, []);

  const fetchRegisteredAuctions = (userId) => {
    const token = localStorage.getItem("authToken");
    axios
      .post(
        "http://localhost:8070/auction/registered-auctions",
        { userId },
        {
          headers: { authToken: token },
        }
      )
      .then((response) => {
        setRegisteredAuctions(response.data); // Set registered auctions
      })
      .catch((error) => {
        console.error("Error fetching registered auctions", error);
      });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (token) {
      axios
        .put("http://localhost:8070/seller/me", formData, {
          headers: { authToken: token },
        })
        .then((response) => {
          setSellerData(response.data);
        })
        .catch((error) => {
          console.error("There was an error updating the seller data!", error);
        });
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Do you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("authToken"); // Remove the token from local storage
      navigate("/ItemListView"); // Navigate to the ItemListView page
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Adding title
    doc.setFontSize(18);
    doc.text("Analytics Report", 14, 22);

    // Adding Most Available Item Categories
    doc.setFontSize(14);
    doc.text("Most Available Item Categories", 14, 40);
    
    // Create table from categoryData
    const tableColumn = ["Category", "Count"];
    const tableRows = categoryData.map(cat => [cat._id, cat.count]);

    doc.autoTable(tableColumn, tableRows, { startY: 50 });

    // Adding Number of Bidders per Auction
    doc.setFontSize(14);
    doc.text("Number of Bidders per Auction", 14, doc.lastAutoTable.finalY + 10);
    
    const bidderTableColumn = ["Auction Title", "Number of Bidders"];
    const bidderTableRows = auctionBidderData.map(auction => [auction.title, auction.bidderCount || 0]);

    doc.autoTable(bidderTableColumn, bidderTableRows, { startY: doc.lastAutoTable.finalY + 10 });

    // Save the PDF
    doc.save("analytics_report.pdf");
  };


  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Nav
            variant="tabs"
            activeKey={activeTab}
            onSelect={(selectedKey) => setActiveTab(selectedKey)}
          >
            <Nav.Item>
              <Nav.Link eventKey="personal-details">Personal details</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="registered-auction">
                Registered auction
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="analytics">Analytics</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="edit-profile">Edit profile</Nav.Link>
            </Nav.Item>
          </Nav>
          <div className="card mt-4 p-4" style={{ marginBottom: 90 }}>
            {activeTab === "personal-details" && sellerData && (
              <>
                <div className="text-center">
                  <img
                    src="/Assests/defaultprofile.jpg"
                    alt="Profile"
                    className="rounded-circle mb-4"
                    style={{
                      width: "150px",
                      height: "150px",
                      backgroundColor: "#f0f0f0",
                    }}
                  />
                </div>

                <Form>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                      <strong>Email :</strong>
                    </Form.Label>
                    <Col sm="9">
                      <Form.Control
                        plaintext
                        readOnly
                        defaultValue={sellerData.email}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                      <strong>Name :</strong>
                    </Form.Label>
                    <Col sm="9">
                      <Form.Control
                        plaintext
                        readOnly
                        defaultValue={`${sellerData.firstName} ${sellerData.lastName}`}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                      <strong>Address :</strong>
                    </Form.Label>
                    <Col sm="9">
                      <Form.Control
                        plaintext
                        readOnly
                        defaultValue={sellerData.address}
                      />
                    </Col>
                  </Form.Group>
                  
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                      <strong>Company :</strong>
                    </Form.Label>
                    <Col sm="9">
                      <Form.Control
                        plaintext
                        readOnly
                        defaultValue={sellerData.companyName || "N/A"}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                      <strong>Birth Day :</strong>
                    </Form.Label>
                    <Col sm="9">
                      <Form.Control
                        plaintext
                        readOnly
                        defaultValue={new Date(
                          sellerData.birthday
                        ).toLocaleDateString()}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                      <strong>Phone Number :</strong>
                    </Form.Label>
                    <Col sm="9">
                      <Form.Control
                        plaintext
                        readOnly
                        defaultValue={sellerData.contactInfo}
                      />
                    </Col>
                  </Form.Group>
                  {/* Logout Button */}
                  <div className="text-center mt-4">
                    <Button variant="danger" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                </Form>
                <div className="text-center mt-4">
                  <Button variant="primary">
                    <a
                      href="/readproduct"
                      style={{
                        color: "white",
                        textDecoration: "none",
                      }}
                    >
                      my orders
                    </a>
                  </Button>
                  
                </div>
                <a href="/Admin">Admin?</a>
              </>
            )}
            {activeTab === "registered-auction" &&
              registeredAuctions.length > 0 && (
                <div>
                  <h5>Registered Auctions</h5>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Starting Date & Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registeredAuctions.map((auction) => {
                        const formattedDate = new Date(
                          auction.startingDateTime
                        ).toLocaleString(); // Format the date and time
                        return (
                          <tr key={auction._id}>
                            <td>{auction.title}</td>
                            <td>{formattedDate}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            {activeTab === "analytics" && categoryData.length > 0 && (
              <div>
                <div style={{ width: "300px", height: "300px" }}>
                  <h5
                  >Most Available Item Categories</h5>
                  <Pie
                    data={chartData}
                    width={20} // Set the width as needed
                    height={20} // Set the height as needed/
                  ></Pie>
                </div>
                <br></br>
                <br></br>
                <br></br>
                

                <div>
    <h5>Number of Bidders per Auction</h5>
    <table className="table">
      <thead>
        <tr>
          <th>Auction Title</th>
          <th>Number of Bidders</th>
        </tr>
      </thead>
      <tbody>
        {auctionBidderData.map((auction) => (
          <tr key={auction.title}>
            <td>{auction.title}</td>
            <td>{auction.bidderCount || 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
                <Button variant="primary" onClick={generatePDF} className="mt-4">
                  Download Report
                </Button>
              </div>
            )}

            {activeTab === "edit-profile" && sellerData && (
              <>
                <Form onSubmit={handleSubmit}>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                      <strong>Email :</strong>
                    </Form.Label>
                    <Col sm="9">
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email || ""}
                        onChange={handleEditChange}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                      <strong>Name :</strong>
                    </Form.Label>
                    <Col sm="9">
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName || ""}
                        onChange={handleEditChange}
                      />
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName || ""}
                        onChange={handleEditChange}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                      <strong>Address :</strong>
                    </Form.Label>
                    <Col sm="9">
                      <Form.Control
                        type="text"
                        name="address"
                        value={formData.address || ""}
                        onChange={handleEditChange}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                      <strong>Phone Number :</strong>
                    </Form.Label>
                    <Col sm="9">
                      <Form.Control
                        type="text"
                        name="contactInfo"
                        value={formData.contactInfo || ""}
                        onChange={handleEditChange}
                      />
                    </Col>
                  </Form.Group>
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>
                </Form>
              </>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
