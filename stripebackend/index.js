const cors=require("cors");
const express=require("express");
//add a stripe key
const stripe = require("stripe")(
  "sk_test_51HP4lxGWayMB2QLmfYqqrl9ErExhxSt5mizUny10wSPyxEQlxZn1wUFLPnkxDAD52tWGXcWppMMQqkoKQRL6eBdG00CrR6n4d9"
);
const { v4: uuidv4 } = require("uuid");

const app=express();
//middleware
app.use(express.json())
app.use(cors());

//routes
app.get("/",(req,res)=>{
    res.send("it works herre")
})
app.post("/payment",(req,res)=>{
    const {token,product}=req.body;
    console.log("product",product);
    console.log("PRICE",product.price);
    const idempontencyKey=uuidv4();
    return stripe.customers.create({
        email:token.email,
        source:token.id
    }).then(customer=>{
        console.log("data recieved from front end")
        stripe.charges.create({
            amount:product.price*100,
            currency:'usd',
            customer:customer.id,
            receipt_email:token.email,
            description:product.name,
            shipping:{
                name:token.card.name,
                address:{
                    country:token.card.address_country
                }
            }
        },{idempontencyKey})
    }).catch(err=>console.log(err))
    .then(result=>{res.status(200).json(result)})
    .catch(err=>console.log(err))


})


//listen
app.listen(8282,()=>{console.log("listening at port 8282")});