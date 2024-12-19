import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import DeliveryHeader from "../delivery/DeliveryHeader";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

export default function ReadProduct() {
    const [addproduct, setAddProduct] = useState([]);
    const [adddelivery, setDeliveries] = useState([]);
    const navigate = useNavigate();

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
        const delivery = adddelivery.find((delivery) => delivery.productId === productId);
        return delivery ? {
            date: delivery.dDate,
            time: delivery.dTime,
            status: delivery.dStates
        } : { date: "N/A", time: "N/A", status: "N/A" };
    };
    

    const handleAddDelivery = (productId) => {
        navigate(`/adddelivery`);
    };

    return (
        <div className="container mt-5">
            <style>
                {`
                    h1 {
                        color: #007bff;
                        margin-bottom: 20px;
                    }
                    table {
                        background-color: #f8f9fa;
                    }
                    th {
                        background-color: #343a40;
                        color: white;
                    }
                    td {
                        vertical-align: middle;
                    }
                `}
            </style>
            <DeliveryHeader />
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
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
