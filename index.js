const express = require("express")
const dotenv = require('dotenv')
const mongoose = require("mongoose")
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const app= express()
const bodyParser = require("body-parser");
// Middleware
app.use(bodyParser.json());
//mongoose connection
dotenv.config()
const connect = async()=>{
    try {
        await mongoose.connect(process.env.MONGO)
        console.log("connected to mdb")
    } catch (error) {
        throw(error)
    }
 }

 mongoose.connection.on("disconnected",()=>{
    console.log("db disconnected ")
})

mongoose.connection.on("connected",()=>{
    console.log("db connected ")
})

app.use("/pharmacies", pharmacyRoutes);


const port =3117
app.listen(port,()=>{
    connect()
    console.log("listening on port: "+port)
})