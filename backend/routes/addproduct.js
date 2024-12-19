const router = require("express").Router();
let Addproduct = require("../models/addproductmodel");

//http://Localhost:8070/addproductmodel/addproduct

router.route("/addproduct").post((req,res)=>{ //Arrow function
    
    const productname = req.body.productname;
    const productwight = req.body.productwight;
    const buyermobile = Number(req.body.buyermobile);
    const quantity = Number(req.body.quantity);
    const buyershomeno = req.body.buyershomeno;
    const buyerstreet = req.body.buyerstreet;
    const buyerscity = req.body.buyerscity;
    const buyersname = req.body.buyersname;
    const deliveryPersonId = req.body.deliveryPersonId; // Add deliveryPersonId

    const newaddproduct = new Addproduct({
        productname,
        productwight,
        buyermobile,
        quantity,
        buyershomeno,
        buyerstreet,
        buyerscity,
        buyersname,
        deliveryPersonId // Include this field



    })
    
    newaddproduct.save().then(()=>{   //pass values to database(Create)
        res.json("Product Record Added")
    }).catch((err)=>{
        console.log(err);
    }) 

})
router.route("/readproduct").get((req,res)=>{
    Addproduct.find().then((addproduct)=>{  //Get all users details(Read)
        
        res.json(addproduct)

    }).catch((err)=>{
        console.log(err)
    })

})
router.route("/deleteproduct/:id").delete(async(req,res)=>{   //(Delete)
    let userid = req.params.id;

    await Addproduct.findByIdAndDelete(userid)
    .then(()=>{
        res.states(200).send({states: "user deleted"});

    }).catch((errr) => {
        console.log(err.message)
        res.states(500).send({states:"Error with delete user",error:err.message});
    })

})
module.exports = router;