const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {checkLogin} = require("../middleware.js");
const{isOwner} = require("../middleware.js");

// Validation middleware for listings
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((e) => e.message).join(", ");
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};

// This function renders the stars in HTML based on the rating
function renderStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += `<i class="fas fa-star ${
        rating <= 2 ? "text-danger" : "text-warning"
      }"></i>`; // red for bad rating, yellow for good
    } else {
      stars += '<i class="fas fa-star text-muted"></i>'; // grey for unfilled stars
    }
  }
  return stars;
}

// Index Route: Display all listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
   
   const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// New Route: Display form to create a new listing
router.get("/new", checkLogin ,(req, res) => {

  res.render("listings/new.ejs");
});

// Create Route: Add a new listing to the database
router.post(
  "/",
  checkLogin,
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = req.body.listing;
    const newList = new Listing(newListing);
    newList.owner = req.user._id;
    await newList.save();
    req.flash('success','Add a new listing sucessfully!');
    res.redirect("/listing");
  })
);

// Show Route: Display details of a single listing
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path :"reviews",
      populate:{
        path: "author",
      }
    })
    .populate("owner");
    if(!listing){
      req.flash("error","Listing doesn't exists ");
      res.redirect('/listing');
    }
   
    res.render("listings/show", { listing, renderStars });
  })
);

// Edit Route: Display form to edit a listing
router.get(
  "/:id/edit",
 checkLogin,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing doesn't exists ");
      res.redirect('/listing');
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// Update Route: Update a listing in the database
router.put(
  "/:id",
  checkLogin,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
 
    await Listing.findByIdAndUpdate(id, {
      title: data.title,
      description: data.description,
      image: data.image,
      price: data.price,
      location: data.location,
      country: data.country,
    });
    req.flash("success","Listing edited sucessfully!");
    res.redirect(`/listing/${id}`);
  })
);

// Delete Route: Remove a listing from the database
router.delete(
  "/:id",
  checkLogin,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted sucessfully!");
    res.redirect("/listing");
  })
);

module.exports = router;
