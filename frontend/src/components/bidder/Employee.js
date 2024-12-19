import React, { useState, useEffect,Link } from "react";
import axios from "axios";

export default function EmployeeSignup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    jobTitle: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:8070/employee", formData);
      alert("Employee Added Successfully!");
      setFormData({ fullName: "", email: "", jobTitle: "" }); // Reset form
    } catch (err) {
      console.error(err);
      setError("Failed to add employee.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8070/employee");
      setEmployees(response.data.employees); // Assuming data is in employees array
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8070/employee/${id}`);
      fetchEmployees(); // Refresh employee list
      alert("Employee deleted successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEmployees(); // Fetch employees on mount
  }, []);

  return (
    <div className="container mt-5">
      <h2>Add Employee</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="fullName"
            className="form-control"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Job Title</label>
          <input
            type="text"
            name="jobTitle"
            className="form-control"
            value={formData.jobTitle}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Adding..." : "Add Employee"}
        </button>
      </form>

      <h2 className="mt-5">Employee List</h2>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Job Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.fullName}</td>
              <td>{employee.email}</td>
              <td>{employee.jobTitle}</td>
              <td>
                <button
                  onClick={() => handleDelete(employee._id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
                {/* Implement Edit functionality here */}
                {/* <button className="btn btn-warning btn-sm">Edit</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button 
      style={
        {
            backgroundColor:"black",
            color:"white",
            padding:"10px 20px",
            border:"none",
            borderRadius:"5px",
            textDecoration:"none",
            cursor:"pointer",
           

        }
      }
      
      >
        <a href="/salaryTable"
        style={{

            textDecoration:"none",
            color:"white",
        }}
        
        >
            calculate salary
        </a>
      </button>
    </div>
  );
}
