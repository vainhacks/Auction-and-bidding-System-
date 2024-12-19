const express = require("express");  //Create variable and assign value
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
require("dotenv").config();
const path = require('path');


const PORT = process.env.PORT || 8070; //If 8070 not avilable assign another avilalabe port number

app.use(cors());
app.use(bodyparser.json());

const URL = process.env.MONGODB_URL; //connect to mongodb

mongoose.connect(URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
   
});

const connection = mongoose.connection;
connection.once("open",() => {  //Open the created connection
    console.log("MongoDb connection success!");
})


/////////////////////////////////////////////////   routes //////////////////////////////
const itemRouter = require("./routes/items"); 
const sellerRouter = require("./routes/sellers");
const auctionRouter = require("./routes/auctions");
const adminRouter = require("./routes/admins");
const bidderRouter = require("./routes/bidders");
const registerRouter = require("./routes/register.js"); 
const addproductRouter = require("./routes/addproduct.js");
const adddeliveryRouter = require("./routes/adddelivery.js");
const adddeliverypersonRouter = require("./routes/adddeliverypersonroute.js");
// const employeeRouter = require("./routes/employees.js");






const salaryRouter = require("../backend/routes/SalaryRoute.js");
const cashRouter = require("../backend/routes/CashRoute.js");
const empRouter = require("../backend/routes/EmployeeRoute.js");
const addRouter = require("../backend/routes/AdRoutes.js");
const seatRoutes = require("./routes/test1");
const paymentRouter = require("./routes/payment");

app.use("/item",itemRouter);
app.use("/seller",sellerRouter);
app.use("/auction",auctionRouter);
app.use("/admin",adminRouter);

////////////////////////////////////////////      sahan      ////////////////////////////////////
app.use("/bidder", bidderRouter);
// app.use("/employee",employeeRouter);


///////////////////////////////////////////////      sadun       /////////////////////////////////

app.use("/registermodel", registerRouter);
app.use("/addproductmodel", addproductRouter); // Use the new router
app.use("/adddeliverymodel",adddeliveryRouter);
app.use("/adddeliveryperson",adddeliverypersonRouter);

//////////////////////////////////////////////        supuni            ////////////////////////////

app.use("/salaries", salaryRouter);
app.use("/cash", cashRouter);
app.use("/employee", empRouter);

//////////////////////////////////////////////// thaveesha    /////////////////////////////////////
app.use("/ads",addRouter);


///////////////////////////////////  anupama   /////////////////////////////////
app.use("/test1", seatRoutes);

///////////////////////////////////// amesh //////////////////////////////
app.use("/payment", paymentRouter);

// Serve static files (for file uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




const Schema = mongoose.Schema;

////////////////////////////////////////   wasantha    ////////////////////////////////

// Bid Schema
const bidSchema = new mongoose.Schema({
    itemId: String,
    amount: Number,
    
    
});

const Bid = mongoose.model('Bid', bidSchema);




// Fetch ongoing bids for an item
app.get('/item/:id/bids', async (req, res) => {
    const bids = await Bid.find({ itemId: req.params.id });
    res.json(bids);
});

// Submit a new bid
app.post('/item/:id/bids', async (req, res) => {
    const newBid = new Bid({
        itemId: req.params.id,
        amount: req.body.amount,
    });
    await newBid.save();
    res.status(201).json(newBid);
});

// Delete all bids for a specific item
app.delete('/item/:id/bids', async (req, res) => {
    try {
        await Bid.deleteMany({ itemId: req.params.id });
        res.status(200).send({ message: "All bids removed successfully." });
    } catch (error) {
        res.status(500).send({ message: "Error removing bids", error });
    }
});

app.listen(PORT,() => {
    console.log(`server is up and running on port number: ${PORT}`)
})

//back end URL for item list manupulation





//////////////////////////////////////////////////////////////////////////////////
app.use('./uploads', express.static(path.join(__dirname, 'uploads')));