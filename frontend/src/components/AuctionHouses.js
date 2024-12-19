import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';



export default function AuctionHouses(props) {
    const [auctions, setAuctions] = useState([]);

    const location1="BMICH Colombo"
    const location2="Kandy KCC"
    const location3="Negambo"

    const Address1 = "SWRD Bandaranaike National Memorial Foundation Bauddhaloka Mawatha, Colombo 07."
    const Address2 = "Kandy City Centre · 5, Dalada Veediya, Kandy · Sri Lanka"
    const Address3 = "St.Joseph Reception Hall Negombo "

    const details="details1"

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await axios.get('http://localhost:8070/auction/all'); // Update with your endpoint
                setAuctions(response.data);
            } catch (error) {
                console.error("Error fetching auctions:", error);
            }
        };

        fetchAuctions();
    }, []);

    return (
        <Container className="my-4">
            <Row>
                
                    <Col md={4}>
                        <Card className="text-center" style={{ height: '100%' }}>
                            <Card.Header>{location1}</Card.Header>
                            <Card.Img variant="top" src='/Assests/bmich.jpg' />
                            <Card.Body>
                                <Card.Text>
                                    <br />
                                    {Address1}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center" style={{ height: '100%' }}>
                            <Card.Header>{location2}</Card.Header>
                            <Card.Img variant="top" src='/Assests/kcc.jpg' />
                            <Card.Body>
                                <Card.Text>
                                    <br />
                                    {Address2}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center" style={{ height: '100%' }}>
                            <Card.Header>{location3}</Card.Header>
                            <Card.Img variant="top" src='/Assests/negambo.jpg' />
                            <Card.Body>
                                <Card.Text>
                                    <br />
                                     {Address3}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                
            </Row>
            
        </Container>
    );
}

