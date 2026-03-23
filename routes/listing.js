const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middlewares.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });



//create route
router.get(
"/new",
isLoggedIn, 
listingController.renderNewForm);

router
.route("/")
.get( wrapAsync(listingController.index))
.post(
isLoggedIn ,
upload.single("listing[image]"),
validateListing, 
wrapAsync(listingController.createListing)
);


router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
isLoggedIn, 
isOwner,
upload.single("listing[image]"),
validateListing, 
wrapAsync(listingController.updateListing)
)
.delete( 
isLoggedIn, 
isOwner ,
wrapAsync(listingController.destroyListing)
);

//Edit route
router.get(
"/:id/edit", 
isLoggedIn, 
isOwner ,
wrapAsync(listingController.renderEditForm));

// serch route
// app.get("/search",
//     wrapAsync(listingController.SearchIndex));

module.exports = router;