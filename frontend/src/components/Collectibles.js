import React, { useEffect, useState } from "react";
import axios from "axios";


import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from 'react-bootstrap';


export default function Collectibles(){
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);  // State to track loading

    useEffect(() => {
        async function getArts() {
          try {
            const response = await axios.get("http://localhost:8070/item/", {
              params: { category: "Collectibles" },
            });
            setItems(response.data);
          } catch (error) {
            console.error("There was an error fetching the items!", error);
          }finally {
            setLoading(false);  // Stop loading once data is fetched
        }
        }
    
        getArts();
      }, []);
      

      

    return (
        <div className="container mt-5">
      <h1 className="text-center mb-4">Collectibles</h1>

      <hr></hr>
      <div className="container" style={{
        width:700,
        height:200
        }}>
          <h6 style={{marginBottom:70}}>
          Collectibles are cherished items that hold personal,
       historical, or cultural significance, often treasured 
       for their rarity and uniqueness. Ranging from vintage toys 
       and coins to stamps, artwork, and memorabilia, collectibles offer 
       a tangible connection to the past, preserving memories and moments 
       in time. For collectors, these items are not just possessions but a 
       reflection of passion, identity, and the joy of discovery. Collectibles
        often appreciate in value over time, making them both sentimental keepsakes
         and potential investments, 
      each piece adding to the story of a collection.

          </h6>
        
      </div>
      <hr></hr>
      
        
      <br></br>
      <div className="row">
                {/* Show loading spinner when items are still being fetched */}
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                    items.map((item, index) => (
                        <div key={index} className="col-md-3 mb-4">
                            <div className="card h-100">
                                <img
                                    src={item.images[0]?.data || 'placeholder-image-url'}
                                    alt={item.name}
                                    className="card-img-top"
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        backgroundColor: '#f0f0f0'
                                    }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{item.name}</h5>
                                    <p className="card-text">{item.description}</p>
                                    <p className="card-text"><strong>Category:</strong> {item.category}</p>
                                    <p className="card-text"><strong>Brand:</strong> {item.brand}</p>
                                    <p className="card-text"><strong>Starting Price:</strong> ${item.startingPrice}</p>
                                    <button className="btn btn-outline-dark ms-2" type="submit">
                                        
                                        View Item
                                    </button>
                                    <button className="btn btn-outline-danger" style={{ float: 'right' }}>
                                        <FontAwesomeIcon icon={faHeart} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <style>{`
                .card {
                    transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
                }
                .card:hover {
                    transform: scale(1.05);
                    background-color: #e0e0e0; /* Change to the desired hover color */
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }
            `}</style>
    </div>
        )
}