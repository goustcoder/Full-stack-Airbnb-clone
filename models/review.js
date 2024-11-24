const { string, number, date } = require('joi');
const { default: mongoose } = require('mongoose');
const mongoes = require('mongoose');
const Schema = mongoes.Schema;
const User = require('./user');

const reviewSchema = new Schema ({
    comment : String,
    rating : {
        type : Number,
        max : 5,
        min :1,
    },
    created_at : {
        type: Date,
        default : Date.now(),
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User", // Ensure the `ref` matches the model name
    }
    
})

module.exports = mongoes.model("Review",reviewSchema);

