import React, { useEffect, useState } from "react";
import axios from "axios";
import '../UpcomingAuctionSection.css';

const URL = "http://localhost:8070/ads";

export default function UpcomingAuctionSection() {
  const [advertisementDetails, setAdvertisementDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const fetchAdvertisementDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(URL);
      setAdvertisementDetails(response.data.ads);
      setError(null);
    } catch (error) {
      console.error("Error fetching advertisement details:", error);
      setError("There was an error fetching the advertisements.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return dateString.split("T")[0];
  };

  useEffect(() => {
    fetchAdvertisementDetails();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentAdIndex((prevIndex) => 
        (prevIndex + 1) % advertisementDetails.length
      );
    }, 10000); // Change ad every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [advertisementDetails.length]);

  const handleNext = () => {
    setCurrentAdIndex((prevIndex) => 
      (prevIndex + 1) % advertisementDetails.length
    );
  };

  const handlePrevious = () => {
    setCurrentAdIndex((prevIndex) => 
      (prevIndex - 1 + advertisementDetails.length) % advertisementDetails.length
    );
  };

  return (
    <div className='containerxv'>
    {isLoading ? (
      <p>Loading...</p>
    ) : error ? (
      <p>{error}</p>
    ) : (
      <div className="banner">
        {advertisementDetails.length > 0 ? (
          <div className="ad-item">
            <div className="image-container">
              {advertisementDetails[currentAdIndex].image && (
                <img
                  src={advertisementDetails[currentAdIndex].image}
                  alt={advertisementDetails[currentAdIndex].title}
                  className="ad-image"
                />
              )}
            </div>
            <div className="ad-details">
              <h4 className="ad-title">{advertisementDetails[currentAdIndex].title}</h4>
              <p className="ad-description">{advertisementDetails[currentAdIndex].description}</p>
              <p className="ad-date">{formatDate(advertisementDetails[currentAdIndex].date)}</p>
            </div>
          </div>
        ) : (
          <p>No Advertisements</p>
        )}
        <div className="navigation-arrows">
          <span onClick={handlePrevious} className="arrow left-arrow">&#10094;</span>
          <span onClick={handleNext} className="arrow right-arrow">&#10095;</span>
        </div>
        
      </div>
    )}
   
  </div>
  );
}
