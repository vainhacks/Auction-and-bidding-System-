// src/components/PaymentList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import 'bootstrap/dist/css/bootstrap.min.css';

const PaymentList = () => {
    const [payments, setPayments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get('http://localhost:8070/payment');
                setPayments(response.data);
            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        };
        fetchPayments();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8070/payment/delete/${id}`);
            setPayments(payments.filter(payment => payment._id !== id));
        } catch (error) {
            console.error('Error deleting payment:', error);
        }
    };

    // Search functionality
    const filteredPayments = payments.filter(payment =>
        payment.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.cardNumber.includes(searchTerm)
    );

    // Generate PDF with a clean structure
    const generateReport = () => {
        const doc = new jsPDF();
        
        // Add header
        const addHeader = () => {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Payment Report', 105, 15, { align: 'center' });
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });
            doc.setLineWidth(0.5);
            doc.line(10, 25, 200, 25); // Horizontal line below header
        };

        // Add footer with page number
        const addFooter = (pageNumber, pageCount) => {
            doc.setFontSize(10);
            doc.text(`Page ${pageNumber} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
            doc.setLineWidth(0.5);
            doc.line(10, doc.internal.pageSize.height - 15, 200, doc.internal.pageSize.height - 15); // Horizontal line above footer
        };

        // AutoTable with payment data
        autoTable(doc, {
            startY: 30,
            head: [['Full Name', 'Card Type', 'Card Number', 'Expiration Date', 'Email', 'Address', 'City', 'State', 'Zip Code']],
            body: filteredPayments.map(payment => [
                payment.fullName,
                payment.cardType,
                '**** **** **** ' + payment.cardNumber.slice(-4), // Masked card number
                `${payment.expirationMonth}/${payment.expirationYear}`,
                payment.email,
                payment.address,
                payment.city,
                payment.state,
                payment.zipCode,
            ]),
            theme: 'grid',
            headStyles: {
                fillColor: [22, 160, 133], // Custom header color
                textColor: [255, 255, 255],
                fontStyle: 'bold',
            },
            bodyStyles: {
                textColor: [0, 0, 0],
            },
            styles: {
                halign: 'center', // Center align all columns
                fontSize: 10,
            },
            didDrawPage: (data) => {
                addHeader();
                const pageCount = doc.internal.getNumberOfPages();
                const currentPage = data.pageNumber;
                addFooter(currentPage, pageCount);
            },
            margin: { top: 40, bottom: 20 },
        });

        // Save the PDF
        doc.save('payment_report.pdf');
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundImage: 'url(https://images.pexels.com/photos/628281/pexels-photo-628281.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '20px',
            color: '#fff'
        }}>
            <div className="container mt-5" style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderRadius: '10px',
                padding: '20px'
            }}>
                <h1 className="text-center mb-4" style={{ color: 'white' }}>Payments</h1>

                {/* Search Bar */}
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

                <table className="table table-striped table-responsive">
                    <thead className="table-dark text-center">
                        <tr>
                            <th>Full Name</th>
                            <th>Card Type</th>
                            <th>Card Number</th>
                            <th>Expiration Date</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Zip Code</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.map(payment => (
                            <tr key={payment._id} className="text-center">
                                <td>{payment.fullName}</td>
                                <td>{payment.cardType}</td>
                                <td>{'**** **** **** ' + payment.cardNumber.slice(-4)}</td>
                                <td>{payment.expirationMonth}/{payment.expirationYear}</td>
                                <td>{payment.email}</td>
                                <td>{payment.address}</td>
                                <td>{payment.city}</td>
                                <td>{payment.state}</td>
                                <td>{payment.zipCode}</td>
                                <td>
                                    <Link to={`/edit/${payment._id}`}>
                                        <button className="btn btn-success me-2">Edit</button>
                                    </Link>
                                    <button className="btn btn-danger" onClick={() => handleDelete(payment._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentList;
