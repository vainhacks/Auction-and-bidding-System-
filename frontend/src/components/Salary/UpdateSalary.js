import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Nav'


export default  function UpdateSalary() {
  const [basicSalary, setBasicSalary] = useState('');
  const [bonus, setBonus] = useState('');
  const [otHours, setOtHours] = useState('');
  const [otRate, setOtRate] = useState('');
  const [otAmount, setOtAmount] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch salary data
  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const response = await axios.get(`http://localhost:8070/salaries/get/${id}`);
        const { BasicSalary, Bonus, OTHours, OTRate } = response.data.salary;
        setBasicSalary(BasicSalary);
        setBonus(Bonus);
        setOtHours(OTHours || '');
        setOtRate(OTRate || '');
      } catch (error) {
        console.error(error);
      }
    };
    fetchSalary();
  }, [id]);

  // Calculate OT amount, EPF, ETF, and total salary
  useEffect(() => {
    const calculatedOtAmount = Math.max(0, parseFloat(otHours) * parseFloat(otRate) || 0);
    setOtAmount(calculatedOtAmount);

    const epf = Math.max(0, parseFloat(basicSalary) * 0.08 || 0);
    const etf = Math.max(0, parseFloat(basicSalary) * 0.03 || 0);

    const calculatedTotalSalary =
      Math.max(0, parseFloat(basicSalary)) +
      Math.max(0, parseFloat(bonus)) +
      calculatedOtAmount - epf - etf || 0;
    setTotalSalary(calculatedTotalSalary);
  }, [basicSalary, bonus, otHours, otRate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseFloat(basicSalary) < 0 || parseFloat(bonus) < 0 || parseFloat(otRate) < 0 || parseFloat(otHours) < 0) {
      alert("Fields cannot contain negative values.");
      return;
    }

    try {
      await axios.put(`http://localhost:8070/salaries/${id}`, {
        BasicSalary: parseFloat(basicSalary),
        Bonus: parseFloat(bonus),
        OTHours: parseFloat(otHours),
        OTRate: parseFloat(otRate),
      });
      navigate(`/salaryTable`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCurrencyChange = (setter) => (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setter(value);
  };

  return (
    <>
      <Nav />
      <div className="container mt-5">
        <h1>Update Salary</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Basic Salary</label>
            <input
              type="text"
              className="form-control"
              value={basicSalary}
              onChange={handleCurrencyChange(setBasicSalary)}
              required
              placeholder="0.00"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Bonus</label>
            <input
              type="text"
              className="form-control"
              value={bonus}
              onChange={handleCurrencyChange(setBonus)}
              required
              placeholder="0.00"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">OT Hours</label>
            <input
              type="number"
              className="form-control"
              value={otHours}
              onChange={(e) => setOtHours(Math.max(0, e.target.value))}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">OT Rate</label>
            <input
              type="text"
              className="form-control"
              value={otRate}
              onChange={handleCurrencyChange(setOtRate)}
            />
          </div>
          <div className="mb-3">
            <h3>OT Amount: {otAmount.toFixed(2)}</h3>
            <h3>Total Salary: {totalSalary.toFixed(2)}</h3>
          </div>
          <button type="submit" className="btn btn-primary">Update Salary</button>
        </form>
      </div>
    </>
  );
}


