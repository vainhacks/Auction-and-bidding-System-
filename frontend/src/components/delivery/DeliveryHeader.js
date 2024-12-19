import React from "react";
import { Link } from "react-router-dom";


export default function DeliveryHeader() {
    return(
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#" style={{color:"red"}}></a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      
      
      
      <li class="nav-item">
        <a class="nav-link" href="/addperson">Register Delivery</a>
      </li>
      <li class="nav-item">
        <Link to="/read" className="nav-link">Delivery person</Link>
      </li>
      
      <li class="nav-item">
        <Link to="/addproduct" className="nav-link">Add product</Link>
      </li>
      
    </ul>
    <form class="form-inline my-2 my-lg-0">
        
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="/readproduct">My Oders <span class="sr-only">(current)</span></a>
      </li>
      
      
      
      
    </ul>
    </div>
        
      
    </form>
  </div>
</nav>

    )
}
