const listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview =  async(req, res) => {
    let Listing = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log("....",newReview);

    Listing.reviews.push(newReview);

    await newReview.save();
    await Listing.save();
    req.flash("success", "new Review created");
    return res.redirect(`/listings/${Listing.id}`);

}