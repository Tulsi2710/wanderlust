const listing = require("../models/listing.js");

module.exports.index =  async (req,res)=> {
    let allListings = await listing.find({});
    res.render("listings/index.ejs", {allListings});
};

// module.exports.SearchIndex =  async (req,res)=> {
//     let searchListings = await listing.find({});
//     res.render("listings/index.ejs", {searchListings});
// };

module.exports.renderNewForm = (req,res)=> {
    console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.createListing  = async(req,res, next)=> {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(req.file);
    let newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "new listing created");
    return res.redirect("/listings");
};

module.exports.showListing = async (req,res)=> {
    console.log(req.user);
    let {id} = req.params;
    let showList = await listing.findById(id)
    .populate({path: "reviews", populate: {path: "author",},
    })
    .populate("owner");
    if(!showList){
        req.flash("error", "Listing you are requested for doesn't exist");
        return res.redirect("/listings");
    }
     res.render("listings/show.ejs", {showList});
};

module.exports.renderEditForm = async (req,res)=> {
    let {id} = req.params;
    const showList = await listing.findById(id);

    if(!showList){
        req.flash("error", "Listing you are requested for doesn't exist");
        return res.redirect("/listings");
    }

    let originalImageUrl = showList.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");

    res.render("listings/edit.ejs", {showList, originalImageUrl});
}; 


module.exports.updateListing = async (req,res)=> {
    let {id} = req.params;
    let Listing = await listing.findByIdAndUpdate(id, {...req.body.listing});
    if (typeof req.file != "undefined"){
       let url = req.file.path;
       let filename = req.file.filename;
       Listing.image = {url, filename};
       await Listing.save();
    }
    req.flash("success", "listing updated!");
    return res.redirect(`/listings/${id}`)
};

module.exports.destroyListing = async (req,res)=> {
    let{id} = req.params;
    let deleteListing = await listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "listing deleted!");
    return res.redirect("/listings");
};

