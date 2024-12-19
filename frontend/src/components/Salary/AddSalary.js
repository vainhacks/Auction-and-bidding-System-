import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Nav from '../Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

function AddSalary() {
  const [basicSalary, setBasicSalary] = useState('');
  const [bonus, setBonus] = useState('');
  const [otHours, setOtHours] = useState('');
  const [otRate, setOtRate] = useState('');
  const [otAmount, setOtAmount] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Calculate OT Amount
    const calculatedOtAmount = Math.max(0, parseFloat(otHours) * parseFloat(otRate) || 0);
    setOtAmount(calculatedOtAmount);

    // Calculate EPF and ETF
    const epf = Math.max(0, parseFloat(basicSalary) * 0.08 || 0);
    const etf = Math.max(0, parseFloat(basicSalary) * 0.03 || 0);

    // Calculate Total Salary
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
      await axios.post('http://localhost:8070/salaries/', {
        userId: id,
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
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <h1 className="mb-4 text-center">Add Salary</h1>
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
                  required
                  placeholder="0"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">OT Rate</label>
                <input
                  type="text"
                  className="form-control"
                  value={otRate}
                  onChange={handleCurrencyChange(setOtRate)}
                  required
                  placeholder="0.00"
                />
              </div>

              <div className="mb-3">
                <h5>OT Amount: {otAmount.toFixed(2)}</h5>
              </div>

              <div className="mb-3">
                <h5>Total Salary: {totalSalary.toFixed(2)}</h5>
              </div>

              <button type="submit" className="btn btn-primary w-100">Add Salary</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddSalary;
