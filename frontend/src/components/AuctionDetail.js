import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Image, Card, Spinner } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../AuctionDetail.css';

export default function AuctionDetail() {
    
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <Container className="text-center" style={{ paddingTop: '50px' }}>
                <Spinner animation="border" variant="primary" />
                <p>Loading auction details...</p>
            </Container>
        );
    }

    if (!auction) {
        return <p>Auction not found.</p>;
    }

    return (
        <Container className="auction-page" style={{ padding: '20px' }}>
            <Card className="mb-4" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <Card.Body>
                    <h1 className="text-center text-dark">{auction.title}</h1>
                    <hr />
                    <Row>
                        <Col md={4}>
                            <p><strong>Date:</strong> {new Date(auction.startingDateTime).toLocaleDateString()}</p>
                            <p><strong>Venue:</strong> {auction.location}</p>
                            <p><strong>Time:</strong> {new Date(auction.startingDateTime).toLocaleTimeString()}</p>
                            <p><strong>Category:</strong> {auction.category}</p>
                            <p>{auction.description}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Row className="mb-4">
                <Col md={3}>
                    <Card style={{ padding: '15px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <h3>Sellers</h3>
                        <div>
                            {auction.registeredUsers && auction.registeredUsers.map((seller, index) => (
                                <div key={index} className="d-flex align-items-center mb-2">
                                    <Image
                                        src="/Assests/defaultprofile.jpg"
                                        roundedCircle
                                        style={{ width: "50px", height: "50px", marginRight: "10px" }}
                                    />
                                    <span>{seller.firstName}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>
                <Col md={9}>
                    <Card style={{ padding: '15px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <h3>Auction Items</h3>
                        <Row>
                            {auction.items && auction.items.map((item, index) => (
                                <Col md={4} key={index} className="mb-3">
                                    <Card className="item-card" style={{ padding: '10px', textAlign: 'center', height: '250px' }}>
                                        <Image
                                            src={item.images[0]?.data || "/default-item.jpg"}
                                            rounded
                                            alt={item.name}
                                            style={{ width: "100px", height: "100px", objectFit: "cover", marginBottom: '10px' }}
                                        />
                                        <h5>{item.name}</h5>
                                        <p>Starting Price: ${item.startingPrice}</p>
                                        <Button variant="secondary">
                                        <Link to={`/Item/${item._id}`} 
                    className="text-white text-decoration-none"
                    >
                    View Item
                    </Link>
                                        </Button>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col className="text-center">
                    <Button variant="danger" size="lg">
                        <Link to={`/RegisterToAuction/${auction._id}`} style={{ color: 'white', textDecoration: 'none' }}>
                            Register to auction
                        </Link>
                    </Button>
                </Col>
            </Row>

            <style>{`
                .item-card {
                    transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
                }
                .item-card:hover {
                    transform: scale(1.05);
                    background-color: #e0e0e0; /* Change to the desired hover color */
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }
            `}</style>
        </Container>
    );
}
