import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

export default function CreateItemListing() {

  const navigate = useNavigate(); // Initialize navigate

  const { id } = useParams(); // Extract auction ID from URL
  const [imagePreviews, setImagePreviews] = useState([]);
  const [images, setImages] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(id); // Set initial state to passed auction ID
  const [name, setName] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Arts");
  const [brand, setBrand] = useState("");
  const [features, setFeatures] = useState("");
  const [material, setMaterial] = useState("");
  const [condition, setCondition] = useState("");

  const [sellerData, setSellerData] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
        axios.get('http://localhost:8070/seller/me', {
            headers: { 'authToken': token }
        })
        .then(response => {
            if (response.data) {
                setSellerData(response.data);
                
            }
        })
        .catch(error => {
            console.error("There was an error fetching the seller data!", error);
        });
    } else {
        console.error("No token found");
    }
}, []);

  // Fetch auctions from the backend when the component mounts
  useEffect(() => {
    axios.get("http://localhost:8070/auction/all")
      .then((res) => {
        setAuctions(res.data);
      })
      .catch((err) => {
        console.error("Error fetching auctions:", err);
      });
  }, []);

  // Filter auctions based on the selected category
  useEffect(() => {
    const filtered = auctions.filter(auction => auction.category === category);
    setFilteredAuctions(filtered);
  }, [category, auctions]);

  // Image upload handler
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...imageUrls]);
    setImages(prev => [...prev, ...files]);
  };

  // Form submission handler
  const sendData = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("startingPrice", startingPrice);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("brand", brand);
    formData.append("features", features);
    formData.append("material", material);
    formData.append("condition", condition);
    formData.append("auction", selectedAuction);
    formData.append("seller", sellerData._id); // Assuming sellerData has _id

    console.log(sellerData._id);

    images.forEach((image) => {
      formData.append("images", image);
    });

    axios.post("http://localhost:8070/item/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        const itemId = res.data.itemId; // Assuming the backend returns the item ID
        return axios.post("http://localhost:8070/auction/add-to-auction", {
          auctionId: selectedAuction,
          itemId: itemId
        })
          .then(() => {
            alert("Item added to auction successfully");
          })
          .catch((err) => {
            alert(err.message);
          });
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const handleRegisterAuction = () => {
    axios
      .post("http://localhost:8070/auction/register", {
        auctionId: selectedAuction,
        userId: sellerData._id, // Assuming sellerData has _id
      })
      .then(() => {
        alert("Registered for the auction successfully");
        navigate("/ItemListView"); // Navigate to ItemListView on success
      })
      .catch((err) => {
        alert("Already Registered for the auction");
        navigate("/ItemListView");
      });
  };

  return (
    <div className="container mt-5 p-4 bg-light rounded shadow-sm">
      
      <h1 className="text-center mb-4">Create Item Listing</h1>
      <form onSubmit={sendData}>
        {/* Image Upload Section */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="d-flex flex-column align-items-center bg-secondary text-white mb-3 rounded py-5">
              <p>Upload Images Here</p>
              <div className="d-flex flex-wrap">
                {imagePreviews.map((image, index) => (
                  <img key={index} src={image} alt={`upload-${index}`} className="img-thumbnail m-2" style={{ width: "100px", height: "100px", objectFit: "cover"
                    
                   }} />
                ))}
                <label className="btn btn-light btn-sm m-2" style={{ width: "100px", height: "100px" }}>
                  <span>+</span>
                  <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleImageUpload} />
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* Item Details Section */}
        <div className="row mb-3">
          <div className="col-md-6 mb-3">
            <label className="form-label">Title:</label>
            <input type="text" className="form-control" onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Brand:</label>
            <input type="text" className="form-control" onChange={(e) => setBrand(e.target.value)} />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6 mb-3">
            <label className="form-label">Category:</label>
            <select className="form-control" onChange={(e) => setCategory(e.target.value)} value={category}>
              <option value="Arts">Arts</option>
              <option value="Collectibles">Collectibles</option>
              <option value="Jewellery">Jewellery</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Features:</label>
            <input type="text" className="form-control" onChange={(e) => setFeatures(e.target.value)} />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6 mb-3">
            <label className="form-label">Starting Price:</label>
            <input type="number" className="form-control" min={1000} onChange={(e) => setStartingPrice(e.target.value)} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Material:</label>
            <input type="text" className="form-control" onChange={(e) => setMaterial(e.target.value)} />
          </div>
        </div>
        <div className="row mb-3">

          <div className="col-md-6 mb-3">
            <label className="form-label">Description:</label>
            <textarea className="form-control" rows="3" onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Condition:</label>
            <input type="text" className="form-control" onChange={(e) => setCondition(e.target.value)} />
          </div>
        </div>
        {/* Auction Selection Section */}
        <div className="row mb-3">
          <div className="col-md-6 mb-3">
            <label className="form-label">Selected Auction:</label>
            <select className="form-control" onChange={(e) => setSelectedAuction(e.target.value)} value={selectedAuction} disabled={filteredAuctions.length === 0}>
              <option value="" disabled>{filteredAuctions.length === 0 ? "No auctions available" : "Select an Auction"}</option>
              {filteredAuctions.map((auction) => (
                <option key={auction._id} value={auction._id}>
                  {auction.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Submit Button */}
        <div className="text-center mt-3">
          <button type="submit" className="btn btn-primary btn-lg" disabled={filteredAuctions.length === 0}>
            Add Item
          </button>
        </div>

      </form>

      <div className="text-center mt-3">
        {/* New Register Button */}
        <button
          className="btn btn-secondary btn-lg"
          onClick={handleRegisterAuction}
          disabled={!selectedAuction}
        >
          Register for Auction
        </button>
      </div>
    </div>
  );
}
