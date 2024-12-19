const router = require("express").Router();
let Adddelivery = require("../models/adddeliveryperson");



router.route("/addperson").post((req,res)=>{ //Arrow function
    
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const number =req.body.number;
    const password = req.body.password;
    const street = req.body.street;
    const city = req.body.city;
    const nic = req.body.nic;
    const dlisen = req.body.dlisen;


    const newAdddelivery = new Adddelivery({
        fname,
        lname,
        email,
        number,
        password,
        street,
        city,
        nic,
        dlisen // Include this field



    })
    
    newAdddelivery.save().then(()=>{   //pass values to database(Create)
        res.json("Product Record Added")
    }).catch((err)=>{
        console.log(err);
    }) 

})
router.route("/readperson").get((req,res)=>{
    Adddelivery.find().then((adddeliverypersonroute)=>{  //Get all users details(Read)
        
        res.json(adddeliverypersonroute)

    }).catch((err)=>{
        console.log(err)
    })

})

router.route("/deleteperson/:id").delete((req, res) => {
    Adddelivery.findByIdAndDelete(req.params.id)
        .then(() => res.json("Delivery person deleted."))
        .catch(err => res.status(400).json("Error: " + err));
});



module.exports = router;