import React, { useState } from "react";
import axios from "axios";
import DeliveryHeader from "../delivery/DeliveryHeader";
export default function AddSalesDetails() {
  const [fname, setfName] = useState("");
  const [lname, setlName] = useState("");
  const [email, setemail] = useState("");
  const [number, setnumber] = useState("");
  const [password, setpassword] = useState("");
  const [street, setstreet] = useState("");
  const [city, setcity] = useState("");
  const [nic, setnic] = useState("");
  const [dlisen, setdlisen] = useState("");

  function sendData(e) {
    e.preventDefault();

    const SalesRegister = {
      fname,
      lname,
      email,
      number,
      password,
      street,
      city,
      nic,
      dlisen,
    };

    axios.post("http://localhost:8070/registermodel/enter", SalesRegister)

      .then(() => {
        alert("Sales added");
        setfName("");
        setlName("");
        setemail("");
        setnumber("");
        setpassword("");
        setstreet("");
        setcity("");
        setnic("");
        setdlisen("");
      })
      .catch((err) => {
        alert(err);
      });
  }

  return (
    <div className="container">
      <DeliveryHeader/>
      <form onSubmit={sendData}>
        <div className="form-group">
          <label htmlFor="fname">First name</label>
          <input
            type="text"
            className="form-control"
            id="fname"
            placeholder="Enter salesmen first name"
            onChange={(e) => {
              setfName(e.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lname">Last name</label>
          <input
            type="text"
            className="form-control"
            id="lname"
            placeholder="Enter salesmen last name"
            onChange={(e) => {
              setlName(e.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            className="form-control"
            id="email"
            placeholder="Enter salesmen email"
            onChange={(e) => {
              setemail(e.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="number">Number</label>
          <input
            type="text"
            className="form-control"
            id="number"
            placeholder="Enter salesmen number"
            onChange={(e) => {
              setnumber(e.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="text"
            className="form-control"
            id="password"
            placeholder="Enter salesmen password"
            onChange={(e) => {
              setpassword(e.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="street">Street</label>
          <input
            type="text"
            className="form-control"
            id="street"
            placeholder="Enter salesmen street"
            onChange={(e) => {
              setstreet(e.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            className="form-control"
            id="city"
            placeholder="Enter salesmen city"
            onChange={(e) => {
              setcity(e.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="nic">NIC</label>
          <input
            type="text"
            className="form-control"
            id="nic"
            placeholder="Enter salesmen NIC"
            onChange={(e) => {
              setnic(e.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="dlisen">DLISEN</label>
          <input
            type="text"
            className="form-control"
            id="dlisen"
            placeholder="Enter salesmen license no"
            onChange={(e) => {
              setdlisen(e.target.value);
            }}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  )
}
