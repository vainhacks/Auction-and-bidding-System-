import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 


export default function MyOrders() {
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

    return (
        <div className="container">
            
            <h1>My Orders</h1>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        
                        <th>Item Name</th>
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
