const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { checkLogin,validateListing } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const {
  index,
  newListingfrom,
  newListingadding,
  showListings,
  editListings,
  editListingsFrom,
  destroyListings,
} = require("../controller/listingsController.js");





// Index Route: Display all listings
router.get("/", wrapAsync(index));

// New Route: Display form to create a new listing
router.get("/new", checkLogin, newListingfrom);

// Create Route: Add a new listing to the database
router.post("/", checkLogin, validateListing, wrapAsync(newListingadding));

// Show Route: Display details of a single listing
router.get("/:id", wrapAsync(showListings));

// Edit Route: Display form to edit a listing
router.get("/:id/edit", checkLogin, isOwner, wrapAsync(editListingsFrom));

// Update Route: Update a listing in the database
router.put(
  "/:id",
  checkLogin,
  isOwner,
  validateListing,
  wrapAsync(editListings)
);

// Delete Route: Remove a listing from the database
router.delete("/:id", checkLogin, isOwner, wrapAsync(destroyListings));

module.exports = router;
