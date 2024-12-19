import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Make sure to use default import if using 'jwt-decode'

export default function Header() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: ""
  });
  const [sellerName, setSellerName] = useState(""); // State to hold seller's name
  const isLoggedIn = localStorage.getItem("authToken") === null ? false : true;
  const accountType = localStorage.getItem("Type");

  useEffect(() => {
    // Function to fetch seller's details
    const fetchSellerData = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const { id } = jwtDecode(token); // Decode token to get seller's ID
          const response = await axios.get('http://localhost:8070/seller/me', {
            headers: {
              'authToken': token
            }
          });
          setSellerName(response.data.firstName + " " + response.data.lastName); // Set seller's name
        } catch (error) {
          console.error("Failed to fetch seller data:", error);
        }
      }
    };
    fetchSellerData();
  }, []);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  // Handle search change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      search: search,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice
    }).toString();
    navigate(`/ItemListView?${query}`);
  };
  const handleLogout = () => {
    const confirmLogout = window.confirm("Do you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("Type");
      navigate("/ItemListView"); // Navigate to the ItemListView page
    }
  };

  return (
    <div>
     <div 
     style={{ color: "white", 
      marginRight: "15px",
      backgroundColor:"black",
      width:"100%",
      
     }}>
     {sellerName && (
      <span
        style={{ color: "white", 
          marginRight: "15px",
          backgroundColor:"black",
          width:"100%",
          paddingTop:"50"


          
         }}
      >{`Welcome back! ${sellerName} ....`}</span>
    )}
     </div>
    
    <nav className="navbar" style={{ background: "black" }}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <a
          className="navbar-brand"
          href="/ItemListView"
          style={{ color: "white", fontSize: 36 }}
        >
          <img
            src="/Assests/bid-master-logo-zip-file/png/logo-white.png"
            alt="Logo"
            width="130"
            height="134"
            className="d-inline-block align-text-center"
          />
          {/*Bid Master*/}
        </a>
        <div
          className="d-flex mx-auto"
          style={{ flex: 1, maxWidth: "600px" }}
        >
          <Dropdown
            style={{
              width: "200px",
              height: "100%",
            }}
          >
            <Dropdown.Toggle
              className="btn btn-outline-light me-2"
              id="filter-dropdown"
            >
              <i className="bi bi-funnel"></i> Filter
            </Dropdown.Toggle>
            <Dropdown.Menu className="p-4 dropdown-menu-custom">
              {/* Price Range Filter */}
              <Dropdown.ItemText>
                <strong>Price Range</strong>
              </Dropdown.ItemText>
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min Price"
                  name="minPrice"
                  min={1000}
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
                <input
                  type="number"
                  className="form-control mt-2"
                  placeholder="Max Price"
                  max={1000000}
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </div>
              {/* Category Filter */}
              <Dropdown.ItemText>
                <strong>Category</strong>
              </Dropdown.ItemText>
              <div className="mb-3">
                <select
                  className="form-select"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  <option value="Art">Art</option>
                  <option value="Jewellery">Jewellery</option>
                  <option value="Collectibles">Collectibles</option>
                  {/* Add more categories as needed */}
                </select>
              </div>
            </Dropdown.Menu>
          </Dropdown>
          <form
            className="d-flex"
            role="search"
            style={{ flex: 1 }}
            onSubmit={handleSearchSubmit}
          >
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Search Items by name"
              name="search"
              value={search}
              onChange={handleSearchChange}
            />
            <button className="btn btn-outline-light ms-2" type="submit">
              Search
            </button>
          </form>
        </div>
        <div
          className="d-flex align-items-center"
          style={{ paddingRight: "15px" }}
        >
          <button className="btn me-2" type="button">
            <div className="heart"></div>
          </button>
          {!isLoggedIn && (
            <button className="btn btn-outline-light me-2" type="button">
              <Link
                to="/Login"
                style={{ color: "white", textDecoration: "none" }}
                onMouseEnter={(e) => (e.target.style.color = "black")}
                onMouseLeave={(e) => (e.target.style.color = "white")}
              >
                Login
              </Link>
            </button>
          )}
          {!isLoggedIn && (
            <button className="btn btn-outline-light me-2" type="button">
              <Link
                to="/ChooseRole"
                style={{ color: "white", textDecoration: "none" }}
                onMouseEnter={(e) => (e.target.style.color = "black")}
                onMouseLeave={(e) => (e.target.style.color = "white")}
              >
                Sign Up
              </Link>
            </button>
          )}
          {isLoggedIn && (
            <button
              className="btn btn-outline-light me-2"
              type="button"
              onClick={handleLogout}
            >
              Log out
            </button>
          )}
          {isLoggedIn && (
            <button className="btn btn-outline-light" type="button">
              <Link
                to={
                  accountType === "bidder"
                    ? "/BidderAccount"
                    : "/SellerAccount"
                }
                style={{ color: "white", textDecoration: "none" }}
                onMouseEnter={(e) => (e.target.style.color = "black")}
                onMouseLeave={(e) => (e.target.style.color = "white")}
              >
                <i
                  className="bi bi-person-circle"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              </Link>
            </button>
            
          )}
          
        </div>
    
      </div>
     
     
    
    </nav>
    
    {/* Page navigation bar */}
    <nav className="navbar navbar-expand-lg ">
      <div className="container-fluid">
        <div className="mx-auto">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/ItemListView" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Auctions" className="nav-link">
                  Auctions
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/AuctionHouses" className="nav-link">
                  Auction Houses
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Category
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/Arts" className="dropdown-item">
                      Art
                    </Link>
                  </li>
                  <li>
                    <Link to="/Jewellery" className="dropdown-item">
                      Jewellery
                    </Link>
                  </li>
                  <li>
                    <Link to="/Collectibles" className="dropdown-item">
                      Collectibles
                    </Link>
                  </li>
                  {/* Add more categories as needed */}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>

  );
}