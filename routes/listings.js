const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { checkLogin, validateListing } = require("../middleware.js");
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

router
  .route("/")
  .get(wrapAsync(index))
  .post(checkLogin, validateListing, wrapAsync(newListingadding));

// New Route: Display form to create a new listing
router.get("/new", checkLogin, newListingfrom);

router
  .route("/:id")
  .get(wrapAsync(showListings))
  .put(checkLogin, isOwner, validateListing, wrapAsync(editListings))
  .delete(checkLogin, isOwner, wrapAsync(destroyListings));

// Edit Route: Display form to edit a listing
router.get("/:id/edit", checkLogin, isOwner, wrapAsync(editListingsFrom));

module.exports = router;
