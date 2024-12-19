import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import jsPDF from "jspdf"; // jsPDF for generating PDFs
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from '../Nav';

const URL = "http://localhost:8070/cash";

const CashRow = ({ cash, onEdit, onDelete }) => {
    const formattedDate = new Date(cash.date).toISOString().split("T")[0];

    return (
        <tr>
            <td>{cash.cashType}</td>
            <td>{formattedDate}</td>
            <td>{cash.description}</td>
            <td>{cash.amount.toFixed(2)}</td>
            <td>
                <FaEdit
                    style={{ cursor: "pointer", marginRight: "10px" }}
                    onClick={() => onEdit(cash._id)}
                />
                <FaTrash
                    style={{ cursor: "pointer", color: "red" }}  // Set the color to red for the delete icon
                    onClick={() => onDelete(cash._id)}
                />
            </td>
        </tr>
    );
};

const fetchHandler = async () => {
    return await axios.get(URL).then((res) => res.data);
};

function CashTable() {
    const [cash, setCash] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCash, setFilteredCash] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalPetiCash, setTotalPetiCash] = useState(0);
    const [netBalance, setNetBalance] = useState(0);
    const navigate = useNavigate();

    // Function to calculate totals and update the state
    const calculateTotals = (cashData) => {
        const incomeTotal = cashData
            .filter((item) => item.cashType === "Income")
            .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

        const expensesTotal = cashData
            .filter((item) => item.cashType === "Expense")
            .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

        const petiCashTotal = cashData
            .filter((item) => item.cashType === "Peti Cash")
            .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

        setTotalIncome(incomeTotal);
        setTotalExpenses(expensesTotal);
        setTotalPetiCash(petiCashTotal);
        setNetBalance(incomeTotal - (expensesTotal + petiCashTotal));
    };

    // Fetch data from the backend
    useEffect(() => {
        fetchHandler().then((data) => {
            const cashData = data.cash;
            setCash(cashData);
            setFilteredCash(cashData); // Set initial filtered cash as full cash
            calculateTotals(cashData); // Calculate totals on initial load
        });
    }, []);

    // Handle row deletion
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${URL}/${id}`);
            const updatedCash = cash.filter((item) => item._id !== id);
            setCash(updatedCash);
            setFilteredCash(updatedCash);
            calculateTotals(updatedCash); // Recalculate totals after deletion
        } catch (error) {
            console.error("Failed to delete item:", error);
        }
    };

    // Handle row edit
    const handleEdit = async (id) => {
        navigate(`/updateCash/${id}`);
    };

    // Handle Add Cash navigation
    const handleAddCash = () => {
        navigate('/cashForm');
    };

    // Handle search filter using a single search bar
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const filtered = cash.filter((item) => {
            const matchType = item.cashType.toLowerCase().includes(value);
            const matchDescription = item.description.toLowerCase().includes(value);

            return matchType || matchDescription;
        });

        setFilteredCash(filtered);
        calculateTotals(filtered); // Recalculate totals for filtered data
    };

    // Generate PDF Report for the summary section
    const generatePDFReport = () => {
        const doc = new jsPDF();
        const today = new Date().toISOString().split("T")[0];

        doc.text("Monthly Cash Summary Report", 10, 10);
        doc.text(`Date: ${today}`, 10, 20);
        doc.text(`Total Income: Rs.${totalIncome.toFixed(2)}`, 10, 30);
        doc.text(`Total Expenses: Rs.${totalExpenses.toFixed(2)}`, 10, 40);
        doc.text(`Total Peti Cash: Rs.${totalPetiCash.toFixed(2)}`, 10, 50);
        doc.text(`Net Balance: Rs.${netBalance.toFixed(2)}`, 10, 60);

        doc.save(`cash-summary-report-${today}.pdf`);
    };

    return (
        <>
        <Nav />
        <div className="container mt-5">
            <div className="row">
                {/* Left Side - Cash Table */}
                <div className="col-lg-8 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h1>Cash Table</h1>
                        <button className="btn btn-primary" onClick={handleAddCash}>
                            Add Cash
                        </button>
                    </div>
                    <hr />
                    {/* Single Search Bar */}
                    <div className="mb-3">
                        <input
                            type="text"
                            name="searchTerm"
                            placeholder="Search by Type or Description"
                            className="form-control"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>Cash Type</th>
                                            <th>Date</th>
                                            <th>Description</th>
                                            <th>Amount</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCash && filteredCash.map((cash) => (
                                            <CashRow
                                                key={cash._id}
                                                cash={cash}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Totals and Net Balance */}
                <div className="col-lg-4 mb-4">
    <div className="card">
        <div className="card-body">
            <h2 className="card-title text-center">Summary</h2>
            {/* Summary Box */}
            <div className="border p-3">
                <div className="d-flex justify-content-between">
                    <strong>Total Income (Rs.):</strong>
                    <span>{totalIncome.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                    <strong>Total Expenses (Rs.):</strong>
                    <span>{totalExpenses.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                    <strong>Total Peti Cash (Rs.):</strong>
                    <span>{totalPetiCash.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                    <strong>Net Balance (Rs.):</strong>
                    <span>{netBalance.toFixed(2)}</span>
                </div>
            </div>
            <button className="btn btn-secondary w-100 mt-3" onClick={generatePDFReport}>
                Download Monthly Report (PDF)
            </button>
        </div>
    </div>
</div>

            </div>
        </div>
        </>
    );
}

export default CashTable;