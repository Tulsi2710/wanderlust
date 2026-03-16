const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middlewares.js");

const reviewController = require("../controllers/review.js");

// create review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
// delete review
router.delete("/:reviewID", isLoggedIn, isReviewAuthor, wrapAsync(async(req,res)=> {
    let {id, reviewID} = req.params;

    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewID}})
    await Review.findByIdAndDelete(reviewID);
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;