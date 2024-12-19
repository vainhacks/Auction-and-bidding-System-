import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BidderSignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    address: "",
    contactInfo: "+94",
    birthday: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setFormData({ ...formData, [name]: value.toLowerCase() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    validateField(name, value);
  };
  const handleKeyPress = (e) => {
    if (
      (e.target.name === "firstName" || e.target.name === "lastName") &&
      !/[a-zA-Z\s]/.test(e.key)
    ) {
      e.preventDefault();
    }
    if (e.target.name === "contactInfo" && !/[0-9+]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const validateField = (name, value) => {
    let fieldErrors = { ...errors };

    switch (name) {
      case "firstName":
      case "lastName":
        fieldErrors[name] = value.match(/^[a-zA-Z\s]+$/)
          ? ""
          : "Name must contain only letters and spaces.";
        break;
        case "email":
          fieldErrors.email = value.match(/^([a-z0-9._%+-]+)@([a-z0-9-]+\.)+[a-z]{2,}$/)
            ? ""
            : "Invalid email address. Please use lowercase letters only.";
          break;
      case "password":
        fieldErrors.password =
          value.length >= 6 ? "" : "Password must be at least 6 characters.";
        break;
      case "contactInfo":
        if (value.startsWith("+94")) {
          fieldErrors.contactInfo = value.match(/^\+94\d{9}$/)
            ? ""
            : "Contact number must start with +94 followed by exactly 9 digits.";
        } else if (value.startsWith("0")) {
          fieldErrors.contactInfo = value.match(/^0\d{9}$/)
            ? ""
            : "Contact number must start with 0 followed by exactly 9 digits.";
        } else {
          fieldErrors.contactInfo = "Contact number must start with +94 or 0.";
        }
        break;
      case "birthday":
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        const isFutureDate = birthDate > today;

        fieldErrors.birthday =
          age >= 16 ? "" : "You must be at least 16 years old.";
        fieldErrors.birthday = isFutureDate
          ? "Future dates are not allowed."
          : fieldErrors.birthday;
        break;
      default:
        fieldErrors[name] = value ? "" : "This field is required.";
        break;
    }

    setErrors(fieldErrors);
  };

  const today = new Date().toISOString().split("T")[0];

  // Set max date to 16 years ago from today
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 16);
  const maxDateString = maxDate.toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(errors).some((error) => error !== "")) {
      alert("Please fix the errors in the form before submitting.");
      return;
    }
    axios
      .post("http://localhost:8070/bidder/add", formData)
      .then((response) => {
        if (response.data === "exist") {
          alert("User already exists");
        } else {
          alert("Bidder Added Successfully!");
          navigate("/Login");

          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            password: "",
            address: "",
            contactInfo: "+94",
            birthday: "",
          });
        }
      })
      .catch((error) => {
        console.error("There was an error adding the seller!", error);
      });
  };

  return (
    <div className="container mt-5 seller-signup-container">
      <h2>Bidder Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3 form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onKeyDown={handleKeyPress}
              onChange={handleChange}
              required
            />
            {errors.firstName && (
              <div className="text-danger">{errors.firstName}</div>
            )}
          </div>
          <div className="col-md-6 mb-3 form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onKeyDown={handleKeyPress}
              onChange={handleChange}
              required
            />
            {errors.lastName && (
              <div className="text-danger">{errors.lastName}</div>
            )}
          </div>
        </div>
        <div className="row">
        <div className="col-md-6 mb-3 form-group">
  <label htmlFor="email">Email</label>
  <input
    type="email"
    className="form-control"
    id="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    required
  />
  {errors.email && <div className="text-danger">{errors.email}</div>}
</div>
          <div className="col-md-6 mb-3 form-group">
            <label htmlFor="contactInfo">Contact Information</label>
            <input
              type="text"
              className="form-control"
              id="contactInfo"
              name="contactInfo"
              onKeyPress={handleKeyPress}
              maxLength={12} // +94 + 9 digits
              placeholder="Enter number starting with +94 or 0"
              value={formData.contactInfo}
              onChange={handleChange}
              required
            />
            {errors.contactInfo && (
              <div className="text-danger">{errors.contactInfo}</div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3 form-group">
            <label htmlFor="gender">Gender</label>
            <select
              className="form-control"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Not Disclose">Not Disclose</option>
            </select>
            {errors.gender && (
              <div className="text-danger">{errors.gender}</div>
            )}
          </div>
          <div className="col-md-6 mb-3 form-group">
            <label htmlFor="birthday">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              id="birthday"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              max={maxDateString} // Restrict dates for users under 16
              required
            />
            {errors.birthday && (
              <div className="text-danger">{errors.birthday}</div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 mb-3 form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              className="form-control"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            {errors.address && (
              <div className="text-danger">{errors.address}</div>
            )}
          </div>
        </div>
        <div className="row">
        <div className="col-md-6 mb-3 form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {errors.username && (
              <div className="text-danger">{errors.username}</div>
            )}
          </div>
          <div className="col-md-6 mb-3 form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <div className="text-danger">{errors.password}</div>
            )}
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
}