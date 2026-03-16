const listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const { ReviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        console.log(req.session.redirectUrl);
        req.flash("error", "you must be logged in to create listings");
        return res.redirect("/login");
    } 
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=> {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let Listing = await listing.findById(id);
    if(!Listing.owner.equals( res.locals.currUser._id)) {
      req.flash("error", "you are not the owner of this listing ");
      return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg )
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let {error} = ReviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg )
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req,res,next) => {
    let {id, reviewID} = req.params;
    let review = await Review.findById(reviewID);
    if(!review.author.equals( res.locals.currUser._id)) {
      req.flash("error", "you are not the Outher of this review ");
      return res.redirect(`/listings/${id}`);
    }
    next();
};