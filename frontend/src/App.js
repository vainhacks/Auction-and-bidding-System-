
import './App.css';
import Header from  './components/Header';
import {BrowserRouter as Router,Route, Routes} from "react-router-dom";

import Auctions from './components/Auctions';
import AuctionHouses from './components/AuctionHouses';
import Footer from './components/Footer';


import ItemListPage from '../src/components/ItemListPage';
import CreateItemListing from './components/CreateItemListing';

import Arts from './components/Arts';
import Jewellery from './components/Jewellery';
import Collectibles from './components/Collectibles';

import ChooseRole from './components/BidderOrSeller';
import Login from './components/Login';
import SellerAccount from './components/SellerAccount';
import SellerSignUp from './components/SellerSignup';
import SellerLogin from './components/SellerLogin';
import AdminPanel from './components/AdminPanel';
import AuctionManagement from './components/AuctionManagement';
import AuctionDetail from './components/AuctionDetail';
import RegisterToAuction from './components/RegisterToAuction';
import RegisterToAuctionAsSeller from './components/RegisterToAuctionAsSeller';
import AdminLogin from './components/AdminLogin';
import ManageItems from './components/ManageItems';
import ManageSellers from './components/ManageSellers';
import ImageUpload from './components/TestImageUpload';


//////////////////// sahan ////////////////////

import BidderSignUp from './components/bidder/BidderSignUp';
import RegisterToAuctionAsBidder from "./components/bidder/RegisterToAuctionAsBidder";
import ManageBidders from './components/bidder/ManageBidders';


//////////////////// sadun ////////////////////
import BidderAccount from "./components/bidder/BidderAccount";
import AddDelivery from './components/delivery/Adddelivery';
import AddDeliveryPerson from './components/delivery/AddDeliveryPerson';
import AddProduct from './components/delivery/AddProduct';
import AddSalesDetails from './components/delivery/AddSalesDetails';
import ReadProduct from './components/delivery/ReadProduct';
import ReadSalesDetails from './components/delivery/ReadSalesDetails';
import EmployeeSignUp from './components/bidder/Employee';
import MyOrders from "./components/delivery/MyOrders";
import DeliverPersonEdit from "./components/delivery/DeliverPersonEdit";


//////////////////// supuni ///////////////////

import Nav from "./components/Nav";

import CashTable from "./components/Cash/CashTable";
import CashForm from "./components/Cash/CashForm";
import UpdateCash from "./components/Cash/UpdateCash";

import AddSalary from "./components/Salary/AddSalary";
import SalaryTable from "./components/Salary/SalaryTable";
import UpdateSalary from "./components/Salary/UpdateSalary";



////////////////////// thaveesha //////////////////////////

import Dashboard from "./components/Dashboard/Dashboard";
import AdvertismentDetails from "./components/AdvertismentDetails/AdvertismentDetails";
import AddAdvertisment from "./components/AddAdvertisment/AddAdvertisment";
import UpdateAdvertisement from "./components/UpdateAdvertisement/UpdateAdvertisement";
 






// import AdvertismentDetails from "./components/AdvertismentDetails/AdvertismentDetails";








/////////////////////////////// anupama//////////////////////////
import AssignSeats from './components/AssignSeats';
import Table from './components/Table';
import SeatingPlan from './components/SeatingPlan';


import BMICH from './components/BMICH';
import NegomboRegal from './components/NegomboRegal';
import JoashPlaceMaharagama from './components/JoashPlaceMaharagama';
import ItemListView from './components/ItemsListView';
import Item from './components/Item';



///////////////////////// ameshaa //////////////////////////////

import PaymentForm from './components/paymentform'; // Import PaymentForm
import PaymentList from './components/PaymentList'; // Import PaymentList
import EditPaymentForm from './components/EditPaymentForm'; // Import EditPaymentForm
function App() {
  return (
    <Router>
    <div className="App">
      <main>
        <Header />
       
     
        <Routes>

        <Route path="/" element={<ItemListPage/>} />

          <Route path="/Auctions" element={<Auctions/>} />
          <Route path="/AuctionHouses" element={<AuctionHouses/>} />
          
          <Route path="/AddItems/:id" element={<CreateItemListing/>} />
          
          <Route path="/Arts" element={<Arts/>}/>
          <Route path="/Jewellery" element={<Jewellery/>}/>
          <Route path="/Collectibles" element={<Collectibles/>}/>
          
          <Route path="/ChooseRole" element={<ChooseRole/>}/>
        
          <Route path="/SellerLogin" element={<SellerLogin/>}/>
          <Route path="/SellerAccount" element={<SellerAccount/>}/>
          <Route path="/SellerSignUp" element={<SellerSignUp/>}/>
          <Route path="/Admin" element={<AdminPanel/>}></Route>
          <Route path="/AuctionManagement" element={<AuctionManagement/>}></Route>
          <Route path="/auction/:id" element={<AuctionDetail/>} />
          <Route path="/RegisterToAuction/:id" element={<RegisterToAuction/>} />
          <Route path="/RegisterToAuction/:id/RegisterToAuctionAsSeller" element={<RegisterToAuctionAsSeller/>} />
          <Route path="/AdminLogin" element={<AdminLogin/>}></Route>

          <Route path="/Admin/items" element={<ManageItems/>} />
          <Route path="/Admin/sellers" element={<ManageSellers/>} />

          <Route path="/Item/:id" element={<Item/>} />  //in construction mode

          <Route path="/ItemListView" element={<ItemListPage/>} />

//sahan routes
          <Route path="/BidderSignUp" element={<BidderSignUp />} />
          <Route path="/Employee" element={<EmployeeSignUp />} />
          <Route path="/Admin/bidders" element={<ManageBidders/>} />

          

  <Route path="/BidderAccount" element={<BidderAccount />} />
  <Route path="/Login" element={<Login/>}/>
  <Route path="/RegisterToAuction/:id/RegisterToAuctionAsBidder" element={<RegisterToAuctionAsBidder/>}/>

          <Route path="/image" element={<ImageUpload/>} />




//sadun routes
          <Route path="/adddelivery" exact element={<AddDelivery/>} />
          <Route path="/addperson" exact element={<AddDeliveryPerson/>} />
          <Route path="/addproduct" exact element={<AddProduct/>} />
          <Route path="/enter" exact element={<AddSalesDetails />} />
          <Route path="/readproduct" exact element={<ReadProduct/>} />

          <Route exact path="/" component={ReadProduct} />

          <Route path="/adddelivery" component={AddDelivery} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/deliveryboy" element={<DeliverPersonEdit />} />


          <Route path="/read" exact element={<ReadSalesDetails/>} />
          
//supuni
                    <Route path="/" element={<Nav />} />

                    <Route path="/cashTable" element={<CashTable />} />
                    <Route path="/cashForm" element={<CashForm />} />
                    <Route path="/updateCash/:id" element={<UpdateCash />} />

                    <Route path="/addSalary/:id" element={<AddSalary />} />
                    <Route path="/salaryTable" element={<SalaryTable />} />
                    <Route path="/updateSalary/:id" element={<UpdateSalary />} />

        


        //thaveesha
        <Route path="/mainDashboard" element={<Dashboard />} />
          <Route path="/AddAdvertisement" element={<AddAdvertisment />} />
          <Route path="/AdvertisementDetails" element={<AdvertismentDetails />} />
          <Route path="/update-advertisement/:id" element={<UpdateAdvertisement />} />
          

//anupama

      <Route path='/AssignSeats' element={<AssignSeats/>}/>
      <Route path='/Table' element={<Table/>}/>
      <Route path='/SeatingPlan' element={<SeatingPlan/>}/>

      <Route path='/BMICH' element={<BMICH/>}/>
      <Route path='/NegomboRegal' element={<NegomboRegal/>}/>
      <Route path='/JoashPlaceMaharagama' element={<JoashPlaceMaharagama/>}/>

// amesha
<Route path="/payment" element={<PaymentForm />} /> {/* Add Payment Form route */}
            <Route path="/payments" element={<PaymentList />} /> {/* Add Payment List route */}
            <Route path="/edit/:id" element={<EditPaymentForm />} /> {/* Add Edit Payment Form route */}

        </Routes>
        <Footer />
        </main>
    </div>
    </Router>
  );
}

export default App;
