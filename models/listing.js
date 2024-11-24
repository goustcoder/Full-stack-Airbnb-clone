const { default: mongoose } = require('mongoose');
const mongoes = require('mongoose');
const Schema = mongoes.Schema;
const Review = require('./review');
const User = require('./user');
const d = "https://unsplash.com/photos/a-long-hallway-with-columns-and-a-clock-on-the-wall-QK2hc38Xlg4" ;

const listingSchema = new Schema ({
    title : {
        type :String,
        required : false,
    },
    description : {
        type :String,


    },

    reviews :[
       {
        type : Schema.Types.ObjectId,
        ref:"Review",
       }
    ],
    owner:{
          type:Schema.Types.ObjectId,
          ref:"User",
    },
    image : 
        
       {
        type: String,   
         default : "https://unsplash.com/photos/a-long-hallway-with-columns-and-a-clock-on-the-wall-QK2hc38Xlg4",
        set :(v)=> v==="" ? "https://unsplash.com/photos/a-long-hallway-with-columns-and-a-clock-on-the-wall-QK2hc38Xlg4" : v,
    },

    price : {
        type :Number,
    },
    location : {
        type :String,
    },
    country : {
        type :String,
    },

})

listingSchema.post("findOneAndDelete",async(doc)=>{
    if(doc.reviews.length){
      await  Review.deleteMany({_id:{$in:doc.reviews}})
    }
    console.log("hello",doc);
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports= Listing;