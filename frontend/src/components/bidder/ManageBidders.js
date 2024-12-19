import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ManageBidders() {
    const [bidders, setBidders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchBidders = async () => {
            try {
                const response = await axios.get("http://localhost:8070/bidder/all");
                setBidders(response.data);
            } catch (error) {
                console.error("Error fetching bidders:", error);
            }
        };
        fetchBidders();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8070/bidder/delete/${id}`);
            setBidders(bidders.filter(bidder => bidder._id !== id));
        } catch (error) {
            console.error("Error deleting bidder:", error);
        }
    };

    //report
    const generateReport = () => {
        const filteredBidder = bidders.filter(bidder => 
            bidder.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bidder.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bidder.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const doc = new jsPDF();
        autoTable(doc, {
            head: [['First Name', 'Last Name', 'Email', 'Address', 'Contact Info', 'Birthday']],
            body: filteredBidder.map(bidder => [
                bidder.firstName,
                bidder.lastName,
                bidder.email,
                bidder.address,
                bidder.contactInfo,
                formatDate(bidder.birthday), // Format the birthday for the report
            ]),
        });
        doc.save('bidders_report.pdf');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Format the date as "MM/DD/YYYY" 
    };

    //search
    const filteredBidders = bidders.filter(bidder => 
        bidder.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bidder.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bidder.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Manage Bidders</h1>
            {/* search */}
            <div className="mb-3 d-flex align-items-center">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="form-control me-2" 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                />
                <button className="btn btn-primary" onClick={generateReport}>
                    Generate Report
                </button>
            </div>
            
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Contact Info</th>
                        <th>Birthday</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBidders.map(bidder => (
                        <tr key={bidder._id}>
                            <td>{bidder.firstName}</td>
                            <td>{bidder.lastName}</td>
                            <td>{bidder.email}</td>
                            <td>{bidder.address}</td>
                            <td>{bidder.contactInfo}</td>
                            <td>{formatDate(bidder.birthday)}</td>
                            <td>
                                <button 
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(bidder._id)}
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