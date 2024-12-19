//Shipping provider details
const router = require("express").Router();
let Register = require("../models/registermodel");

//http://Localhost:8070/registermodel/enter

router.route("/enter").post((req,res)=>{ //Arrow function

    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const password = req.body.password;
    const number = Number(req.body.number);
    const street = req.body.street;
    const city = req.body.city;

    const newregister = new Register({
        fname,
        lname,
        email,
        password,
        number,
        street,
        city



    })
    
    newregister.save().then(()=>{   //pass values to database(Create)
        res.json("Record Added")
    }).catch((err)=>{
        console.log(err);
    }) 

})
router.route("/read").get((req,res)=>{
    Register.find().then((register)=>{  //Get all users details(Read)
        
        res.json(register)

    }).catch((err)=>{
        console.log(err)
    })

})
router.route("/deleteperson/:id").delete(async(req,res)=>{   //(Delete)
    let userid = req.params.id;

    await Register.findByIdAndDelete(userid)
    .then(()=>{
        res.states(200).send({states: "user deleted"});

    }).catch((errr) => {
        console.log(err.message)
        res.states(500).send({states:"Error with delete user",error:err.message});
    })

})
module.exports = router;