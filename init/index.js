const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");
main().then((res)=>{
    console.log("connect to db");
})
.catch((err)=>{
    console.log(err);
})
async function main (){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


const initDB = async ()=>{
   await Listing.deleteMany({});
   initData.data=initData.data.map((elem)=>({...elem,owner:"67406a0fa55313fe1d7b669e"}))
   await Listing.insertMany(initData.data);
   console.log("data was initialized");
}

initDB();