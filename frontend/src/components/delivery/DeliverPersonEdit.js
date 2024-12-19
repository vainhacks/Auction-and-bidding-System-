import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Replace useHistory with useNavigate



export default function ReadProduct() {
    const [addproduct, setAddProduct] = useState([]);
    const [adddelivery, setDeliveries] = useState([]);
    const navigate = useNavigate(); // Use useNavigate instead of useHistory

    useEffect(() => {
        const getAddProduct = () => {
            axios.get("http://localhost:8070/addproductmodel/readproduct")
                .then((res) => {
                    setAddProduct(res.data);
                })
                .catch((err) => {
                    alert(err.message);
                });
        };

        // Fetch delivery data
        const getDeliveries = () => {
            axios.get("http://localhost:8070/adddeliverymodel/readdelivery")
                .then((res) => {
                    setDeliveries(res.data);
                })
                .catch((err) => {
                    alert(err.message);
                });
        };

        getAddProduct();
        getDeliveries();
    }, []);

    const getDeliveryDetails = (productId) => {
        const delivery = adddelivery.find((delivery) => delivery.productId === productId); // Adjust this line based on your schema
        return delivery ? {
            date: delivery.dDate,
            time: delivery.dTime,
            status: delivery.dStates
        } : { date: "N/A", time: "N/A", status: "N/A" };
    };

    // Function to navigate to AddDelivery page
    const handleAddDelivery = (productId) => {
        navigate(`/adddelivery`); // Navigate to AddDelivery page
    };

    return (
        <div className="container">
           
            <h1>My Delivery Orders</h1>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        
                        <th>Item Name</th>
                        <th>Item Weight</th>
                        <th>Buyer's Mobile</th>
                        <th>Quantity</th>
                        <th>Buyers Address</th>
                        <th>Buyer's Name</th>
                        <th>Delivery Date</th>
                        <th>Delivery Time</th>
                        <th>Delivery Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {addproduct.map((addproductmodel, index) => {
                        const deliveryDetails = getDeliveryDetails(addproductmodel.id); 
                        return (
                            <tr key={index}>
                                
                                <td>{addproductmodel.productname}</td>
                                <td>{addproductmodel.productwight}</td>
                                <td>{addproductmodel.buyermobile}</td>
                                <td>{addproductmodel.quantity}</td>
                                <td>{`${addproductmodel.buyershomeno}, ${addproductmodel.buyerstreet}, ${addproductmodel.buyerscity}`}</td>
                                <td>{addproductmodel.buyersname}</td>
                                <td>{deliveryDetails.date}</td>
                                <td>{deliveryDetails.time}</td>
                                <td>{deliveryDetails.status}</td>
                                <td>
                                    <button onClick={() => handleAddDelivery(addproductmodel.id)} className="btn btn-primary">
                                        Edit Delivery
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
