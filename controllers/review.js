const listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
    let listingData = await listing.findById(req.params.id);

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listingData.reviews.push(newReview);

    await newReview.save();
    await listingData.save();

    req.flash("success", "New review created!");
    return res.redirect(`/listings/${listingData._id}`);
};