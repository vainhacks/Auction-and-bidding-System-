import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf'; // Import jsPDF
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import Nav from '../Nav';

const URL = "http://localhost:8070/employee"; // Employee API URL

const SalaryRow = ({ employee, salary, onDeleteSalary, onGenerateReport }) => {
  return (
    <tr>
      <td>{employee.fullName}</td>
      <td>{employee.email}</td>
      <td>{employee.jobTitle}</td>
      <td className="text-end">{salary ? salary.TotalSalary.toFixed(2) : 'N/A'}</td>
      <td className="text-center">
        <div className="d-flex justify-content-center">
          <Link
            to={`/addsalary/${employee._id}`}
            className={`btn btn-primary btn-sm me-2 ${salary ? 'disabled' : ''}`}
          >
            Add Salary
          </Link>
          <Link to={`/updatesalary/${employee._id}`} className="btn btn-secondary btn-sm me-2">
            Update Salary
          </Link>
          {salary && (
            <button onClick={() => onDeleteSalary(employee._id)} className="btn btn-sm me-2">
              <i className="fas fa-trash" style={{ color: 'red' }}></i>
            </button>
          )}
          {salary && (
            <button onClick={() => onGenerateReport(employee, salary)} className="btn btn-sm btn-info">
              <i className="fas fa-download"></i> {/* Download icon */}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function SalaryTable() {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      const data = await fetchHandler();
      setEmployees(data.employees);
      const salariesData = await Promise.all(
        data.employees.map(async (employee) => {
          try {
            const response = await axios.get(`http://localhost:8070/salaries/get/${employee._id}`);
            return { employeeId: employee._id, salary: response.data.salary };
          } catch (error) {
            console.error(`Error fetching salary for employee ${employee._id}:`, error);
            return { employeeId: employee._id, salary: null };
          }
        })
      );
      const salaryMap = {};
      salariesData.forEach((item) => {
        salaryMap[item.employeeId] = item.salary;
      });
      setSalaries(salaryMap);
    };

    fetchEmployees();
  }, []);

  const handleDeleteSalary = async (employeeId) => {
    try {
      await axios.delete(`http://localhost:8070/salaries/${employeeId}`);
      setSalaries((prevSalaries) => ({
        ...prevSalaries,
        [employeeId]: null,
      }));
    } catch (error) {
      console.error(`Error deleting salary for employee ${employeeId}:`, error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleGenerateReport = (employee, salary) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Salary Report', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Full Name: ${employee.fullName}`, 14, 40);
    doc.text(`Email: ${employee.email}`, 14, 50);
    doc.text(`Job Title: ${employee.jobTitle}`, 14, 60);

    // Add detailed salary information
    if (salary) {
      doc.text(`Basic Salary: ${salary.BasicSalary.toFixed(2)}`, 14, 90);
      doc.text(`Bonus: ${salary.Bonus.toFixed(2)}`, 14, 100);
      doc.text(`OT Hours: ${salary.OTHours}`, 14, 110);
      doc.text(`OT Rate: ${salary.OTRate.toFixed(2)}`, 14, 120);
      doc.text(`Total Salary: ${salary.TotalSalary.toFixed(2)}`, 14, 130);
    } else {
      doc.text(`Total Salary: N/A`, 14, 90);
    }

    doc.save(`${employee.fullName}_Salary_Report.pdf`);
  };

  const filteredEmployees = employees.filter(employee =>
    employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Nav />
      <div className="container mt-5">
        <h1>Salary Table</h1>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Job Title</th>
                <th>Total Salary (Rs.)</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <SalaryRow
                  key={employee._id}
                  employee={employee}
                  salary={salaries[employee._id]}
                  onDeleteSalary={handleDeleteSalary}
                  onGenerateReport={handleGenerateReport}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default SalaryTable;