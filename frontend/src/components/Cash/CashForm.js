import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from '../Nav';
import "bootstrap/dist/css/bootstrap.min.css";

function CashForm() {
    const [amount, setAmount] = useState("");
    const [cashType, setCashType] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (parseFloat(amount) < 0) {
            alert("Amount cannot be negative.");
            return;
        }
        
        try {
            await axios.post("http://localhost:8070/cash/", {
                amount: parseFloat(amount),
                cashType,
                date,
                description,
            });
            navigate("/cashTable");
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancel = () => {
        navigate("/cashTable");
    };

    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/[^0-9.]/g, ''); // Allow only numbers and decimal point
        setAmount(value);
    };

    return (
        <>
            <Nav />
            <div className="container vh-100 d-flex align-items-center justify-content-center">
                <div className="col-lg-6">
                    <h1 className="mb-4 text-center">Add Cash</h1>
                    <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
                        <div className="mb-3">
                            <label className="form-label">Cash Type</label>
                            {["Income", "Expense", "Peti Cash"].map((type) => (
                                <div className="form-check" key={type}>
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        value={type}
                                        checked={cashType === type}
                                        onChange={(e) => setCashType(e.target.value)}
                                        required
                                    />
                                    <label className="form-check-label">{type}</label>
                                </div>
                            ))}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Amount</label>
                            <input
                                type="text"
                                className="form-control"
                                value={amount}
                                onChange={handleAmountChange}
                                required
                            />
                        </div>

                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary me-2">
                                Add Cash
                            </button>
                            <button type="button" onClick={handleCancel} className="btn btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CashForm;
