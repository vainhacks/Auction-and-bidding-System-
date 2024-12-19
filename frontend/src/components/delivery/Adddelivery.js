import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";


export default function AddDelivery() {
  const [dDate, setdDate] = useState("");
  const [dTime, setdTime] = useState("");
  const [dStates, setdStates] = useState("");
  const [dateError, setDateError] = useState(""); // State for error message
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("productId");

  useEffect(() => {
    if (productId) {
      // Fetch existing delivery details for the product
      axios.get(`http://localhost:8070/adddeliverymodel/readdelivery`)
        .then((res) => {
          const delivery = res.data;
          setdDate(delivery.dDate);
          setdTime(delivery.dTime);
          setdStates(delivery.dStates);
        })
        .catch((err) => {
          console.error(err.message);
        });
    }
  }, [productId]);

  function sendData(e) {
    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];
    if (dDate < today) {
        setDateError("Delivery date cannot be before today.");
        return;
    } else {
        setDateError(""); 
    }

    const adddeliverys = {
        productId,  // Pass productId to link the delivery to the product
        dDate,
        dTime,
        dStates,
    };

    axios
      .post("http://localhost:8070/adddeliverymodel/adddelivery", adddeliverys)
      .then(() => {
        alert("Delivery added/updated");
        setdDate("");
        setdTime("");
        setdStates("");
      })
      .catch((err) => {
        alert(err);
      });
}


  return (
    <div className="container">
    
      <form onSubmit={sendData}>
        <div className="form-group">
          <label htmlFor="dDate">Delivery Date</label>
          <input
            type="date"
            className="form-control"
            id="dDate"
            placeholder="Enter delivery date"
            value={dDate}
            onChange={(e) => setdDate(e.target.value)}
          />
          {/* Display error message below the date field */}
          {dateError && <small className="text-danger">{dateError}</small>}
        </div>
        <div className="form-group">
          <label htmlFor="dTime">Delivery Time</label>
          <input
            type="time"
            className="form-control"
            id="dTime"
            placeholder="Enter delivery time"
            value={dTime}
            onChange={(e) => setdTime(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="dStates">Delivery States</label>
          <input
            type="text"
            className="form-control"
            id="dStates"
            placeholder="Enter delivery states"
            value={dStates}
            onChange={(e) => setdStates(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
