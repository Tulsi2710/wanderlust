const mongoose = require("mongoose");
const { Schema } = require("./listing");
// const { String, Number } = require("joi");
let Schemaa = mongoose.Schema;
const User = require("./user");

const reviewSchema = new Schemaa ({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    cretedAt: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: Schemaa.Types.ObjectId,
        ref: "User"
    }
});
module.exports = mongoose.model("Review", reviewSchema);