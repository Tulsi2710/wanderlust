const mongoose = require("mongoose");
let Schema = mongoose.Schema;
let Review = require("./review");
const review = require("./review");

let listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description : {
        type: String
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

listingSchema.post("findOneAndDelete", async(listing)=> {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews} })
    }
});

 let listing = mongoose.model ("listing", listingSchema);

 module.exports = listing; 