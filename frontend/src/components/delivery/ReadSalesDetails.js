import React, { useState, useEffect } from "react";
import axios from "axios";
import DeliveryHeader from "../delivery/DeliveryHeader";

export default function ReadSalesDetails() {
    const [adddeliverypersonroute, setadddeliverypersonroute] = useState([]);

    useEffect(() => {
        function getRegister() {
            axios.get("http://localhost:8070/adddeliveryperson/readperson")
                .then((res) => {
                    console.log(res.data);
                    setadddeliverypersonroute(res.data);
                })
                .catch((err) => {
                    alert(err.message);
                });
        }
        getRegister();
    }, []);

    // Define the handleDelete function here
    const handleDelete = (id) => {
        axios.delete(`http://localhost:8070/adddeliveryperson/deleteperson/${id}`)
            .then(() => {
                alert("Delivery person deleted successfully");
                setadddeliverypersonroute(adddeliverypersonroute.filter(person => person._id !== id)); // Remove the deleted person from the state
            })
            .catch((err) => {
                alert("Error deleting delivery person: " + err.message);
            });
    };

    return (
        <div className="container">
            <DeliveryHeader/>
            <h1>All Delivery Persons</h1>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Street</th>
                        <th>City</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {adddeliverypersonroute.map((adddeliveryperson, index) => (
                        <tr key={index}>
                            <td>{adddeliveryperson.fname}</td>
                            <td>{adddeliveryperson.lname}</td>
                            <td>{adddeliveryperson.email}</td>
                            <td>{adddeliveryperson.number}</td>
                            <td>{adddeliveryperson.street}</td>
                            <td>{adddeliveryperson.city}</td>
                            <td>
                                {/* Delete button */}
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(adddeliveryperson._id)}
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
