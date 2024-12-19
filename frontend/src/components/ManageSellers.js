import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ManageSellers() {
    const [sellers, setSellers] = useState([]);

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const response = await axios.get("http://localhost:8070/seller/all");
                setSellers(response.data);
            } catch (error) {
                console.error("Error fetching sellers:", error);
            }
        };
        fetchSellers();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8070/seller/delete/${id}`);
            setSellers(sellers.filter(seller => seller._id !== id));
        } catch (error) {
            console.error("Error deleting seller:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Manage Sellers</h1>
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Telephone</th>
                        <th>Company</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sellers.map(seller => (
                        <tr key={seller._id}>
                            <td>{seller.firstName}</td>
                            <td>{seller.lastName}</td>
                            <td>{seller.email}</td>
                            <td>{seller.address}</td>
                            <td>{seller.contactInfo}</td>
                            <td>{seller.companyName}</td>
                            <td>
                                <button 
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(seller._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
