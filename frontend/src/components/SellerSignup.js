import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SellerSignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    country: "",
    address: "",
    companyName: "",
    businessAddress: "",
    contactInfo: "+94",
    paymentMethod: "Bank Transfer",
    birthday: "",
  });


  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle input changes
    setFormData({ ...formData, [name]: value });

    // Validate fields
    validateField(name, value);

    if (name === "contactInfo") {
      // Ensure the input starts with "+94" and has at most 9 digits after it
      if (value.startsWith("+94")) {
        const digitsAfterPrefix = value.slice(3);
        
        if (digitsAfterPrefix.length <= 9 && /^\d*$/.test(digitsAfterPrefix)) {
          setFormData({
            ...formData,
            [name]: value,
          });
        }
      } else {
        // If user tries to delete or change "+94", prevent the change
        setFormData({
          ...formData,
          [name]: "+94",
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleKeyPress = (e) => {
    // Allow only letters and spaces for name fields
    if ((e.target.name === "firstName" || e.target.name === "lastName") && !/[a-zA-Z\s]/.test(e.key)) {
      e.preventDefault();
    }
    // Allow only digits (0-9) and prevent non-digit input for contactInfo
    if (e.target.name === "contactInfo" && !/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
    if (e.target.name === "email") {
      const input = e.target.value;
      const atSymbol = e.key === "@";
  
      if ((atSymbol && input.length === 0) || 
      (atSymbol && input.includes("@")) || // Prevent multiple '@' symbols
      (!/[a-z0-9@.]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete")) {
      e.preventDefault();
  }
  
  }
  if (e.target.name === "address" && !/[a-zA-Z0-9\s,]/.test(e.key)) {
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
        fieldErrors.email = value.match(/^(?!@)[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)

          ? ""
          : "Invalid email address.";
        break;
      case "password":
        fieldErrors.password =
          value.length >= 6 ? "" : "Password must be at least 6 characters.";
        break;
        case "contactInfo":
      fieldErrors.contactInfo =
        value.match(/^\+94\d{9}$/)
          ? ""
          : "Contact number must start with +94 and be followed by exactly 9 digits.";
      break;
        case "birthday":
          const today = new Date();
          const birthDate = new Date(value);
          const age = today.getFullYear() - birthDate.getFullYear();
          const isFutureDate = birthDate > today;
    
          fieldErrors.birthday = age >= 16 ? "" : "You must be at least 16 years old.";
          fieldErrors.birthday = isFutureDate ? "Future dates are not allowed." : fieldErrors.birthday;
          break;
          case "address":
      fieldErrors.address = value.match(/^[a-zA-Z0-9\s,]*$/)
        ? ""
        : "Address can only contain letters, numbers, spaces, and commas.";
      break;
          
      default:
        fieldErrors[name] = value ? "" : "This field is required.";
        break;
    }

    setErrors(fieldErrors);
  };
  // Set today's date in yyyy-mm-dd format
  const today = new Date().toISOString().split('T')[0];


  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(errors).some((error) => error !== "")) {
      alert("Please fix the errors in the form before submitting.");
      return;
    }
    axios
      .post("http://localhost:8070/seller/add", formData)
      .then((response) => {
        if (response.data === "exist") {
          alert("User already exists");
        } else {
          alert("Seller Added Successfully!");
          navigate("/sellerlogin");

          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            password: "",
            country: "",
            address: "",
            companyName: "",
            businessAddress: "",
            contactInfo: "+94",
            paymentMethod: "",
            NicDetails: "",
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
      <h2>Seller Registration</h2>
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
              onKeyDown={handleKeyPress} // Restrict input to letters only
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
              onKeyDown={handleKeyPress} // Restrict input to letters only
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
              onKeyDown={handleKeyPress} 
              onChange={handleChange}
              required
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
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
        </div>
        <div className="row">
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
          <div className="col-md-6 mb-3 form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              className="form-control"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              defaultValue={"Sri lanka"}
              placeholder="Sri Lanka"
              disabled
              required
            />
            {errors.country && (
              <div className="text-danger">{errors.country}</div>
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
              onKeyDown={handleKeyPress} 
              value={formData.address}
              onChange={handleChange}
              
            />
            {errors.address && (
              <div className="text-danger">{errors.address}</div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3 form-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              className="form-control"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              
            />
            {errors.companyName && (
              <div className="text-danger">{errors.companyName}</div>
            )}
          </div>
          <div className="col-md-6 mb-3 form-group">
            <label htmlFor="businessAddress">Business Address</label>
            <input
              type="text"
              className="form-control"
              id="businessAddress"
              name="businessAddress"
              value={formData.businessAddress}
              onChange={handleChange}
              
            />
            {errors.businessAddress && (
              <div className="text-danger">{errors.businessAddress}</div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3 form-group">
            <label htmlFor="contactInfo">Contact Information</label>
            <input
        type="text"
        className="form-control"
        id="contactInfo"
        name="contactInfo"
        value={formData.contactInfo || "+94"} // Pre-fill "+94"
        onKeyPress={handleKeyPress}
        onChange={handleChange}
        maxLength={12} // "+94" + 9 digits
        required
      />
            {errors.contactInfo && (
              <div className="text-danger">{errors.contactInfo}</div>
            )}
          </div>
          <div className="col-md-6 mb-3 form-group">
            <label htmlFor="paymentMethod">Preferred Payment Method</label>
            <div className="input-group">
              <select
                className="form-control"
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Payment Method
                </option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="PayPal">PayPal</option>
              </select>
              <div className="input-group-append">
                <span className="input-group-text">
                  <i className="fa fa-caret-down"></i>
                </span>
              </div>
            </div>
            {errors.paymentMethod && (
              <div className="text-danger">{errors.paymentMethod}</div>
            )}
          </div>
        </div>
       <div className="row">
          <div className="col-md-6 mb-3 form-group">
            <label htmlFor="birthday">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              id="birthday"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              max={new Date().getFullYear() - 16 + "-12-31"} // Restrict future dates
              required
            />
            {errors.birthday && (
              <div className="text-danger">{errors.birthday}</div>
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

export default SellerSignUp;
