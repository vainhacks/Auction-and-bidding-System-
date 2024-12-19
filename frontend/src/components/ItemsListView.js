import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { Link} from "react-router-dom";

export default function ItemListView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const getQueryParams = () => {
    const query = new URLSearchParams(location.search);
    return {
      search: query.get("search") || "",
      category: query.get("category") || "",
      minPrice: query.get("minPrice") || "",
      maxPrice: query.get("maxPrice") || "",
    };
  };

  const getItems = () => {
    const { search, category, minPrice, maxPrice } = getQueryParams();
    setLoading(true);
    axios
      .get("http://localhost:8070/item", {
        params: { search, category, minPrice, maxPrice },
      })
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the items!", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getItems();
  }, [location.search]);

  return (
    <div className="container mt-5">
       <hr ></hr>
      <h1 className="text-center mb-4">ITEMS</h1>
      {/* Filter Inputs */}
      <div className="row mb-4">{/* Add form inputs for filters */}</div>
      {/* Loading Spinner */}
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {items.length === 0 ? (
            <div className="text-center">
              <p>No items match your search criteria.</p>
            </div>
          ) : (
            items.map((item, index) => (
              <div key={index} className="col-md-3 mb-4">
                <div className="card h-100 ">
                  {/* Image Carousel */}
                  <img
                    src={item.images[0]?.data || "placeholder-image-url"}
                    alt={item.name}
                    className="card-img-top"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      backgroundColor: "#f0f0f0",
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">{item.description}</p>
                    <p className="card-text">
                      <strong>Category:</strong> {item.category}
                    </p>
                    <p className="card-text">
                      <strong>Brand:</strong> {item.brand}
                    </p>
                    <p className="card-text">
                      <strong>Starting Price:</strong> ${item.startingPrice}
                    </p>
                    <button className="btn btn-dark" type="submit">
                    <Link to={`/Item/${item._id}`} 
                    className="text-white text-decoration-none"
                    >
                    View Item
                    </Link>
                      
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      style={{ float: "right" }}
                    >
                      <FontAwesomeIcon icon={faHeart} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <style>{`
                .card {
                    transition: transform 0.3s ease-in-out;
                }
                .card:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                }
                .btn-primary {
                    background-color: #007bff;
                    border-color: #007bff;
                    transition: background-color 0.3s ease;
                }
                .btn-primary:hover {
                    background-color: #0056b3;
                }
            `}</style>
    </div>
  );
}
