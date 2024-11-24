const { default: mongoose } = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const User = require('./user');

const listingSchema = new Schema({
    title: {
        type: String,
        required: false,
    },
    description: {
        type: String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    image: {
        url: {
            type: String, // Should be a string
        },
        filename: {
            type: String, // Should be a string
        },
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
});

listingSchema.post("findOneAndDelete", async (doc) => {
    if (doc.reviews.length) {
        await Review.deleteMany({ _id: { $in: doc.reviews } });
    }
    console.log("Deleted listing:", doc);
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
