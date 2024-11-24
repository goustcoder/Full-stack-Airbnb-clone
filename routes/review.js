// Import necessary modules
const express = require("express");
const router = express.Router({ mergeParams: true }); // Create a new Router instance with `mergeParams` to allow access to parent route parameters (`req.params.id`)
const ExpressError = require("../utils/ExpressError.js"); // Custom error handling utility
const wrapAsync = require("../utils/wrapAsync.js"); // Utility to handle async errors
const { reviewSchema } = require("../schema.js"); // Schema for validating review data
const Listing = require("../models/listing.js"); // Listing model to interact with the database
const Review = require("../models/review.js"); // Review model to interact with the database
const { checkLogin, isOwner, validateReview } = require("../middleware.js");
const {
  addReview,
  destroyReview,
} = require("../controller/reviewController.js");

// POST Route: Add a new review to a listing
router.post(
  "/", // Base path is defined in the parent route (e.g., `/listing/:id/reviews`)
  checkLogin,
  validateReview, // Middleware to validate review data before proceeding
  wrapAsync(addReview)
);

// DELETE Route: Delete a review from a listing
router.delete("/:Revid", checkLogin, isOwner, destroyReview);

// Export the router to be used in the main app
module.exports = router;

/**
 * Key Points:
 * - This router is responsible for managing reviews associated with listings.
 * - Reviews are stored in their own collection and referenced in the `reviews` array of each listing.
 * - Validation ensures that only valid review data is accepted.
 * - `mergeParams: true` is crucial to access `req.params.id` from the parent route in nested routes.
 * - The `POST` route adds a new review to the listing and saves it in the database.
 * - The `DELETE` route removes the review from both the `reviews` array in the listing and the `Review` collection.
 */
