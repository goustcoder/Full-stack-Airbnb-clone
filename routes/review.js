// Import necessary modules
const express = require('express');
const router = express.Router({ mergeParams: true }); // Create a new Router instance with `mergeParams` to allow access to parent route parameters (`req.params.id`)
const ExpressError = require("../utils/ExpressError.js"); // Custom error handling utility
const wrapAsync = require("../utils/wrapAsync.js"); // Utility to handle async errors
const { reviewSchema } = require("../schema.js"); // Schema for validating review data
const Listing = require("../models/listing.js"); // Listing model to interact with the database
const Review = require("../models/review.js"); // Review model to interact with the database
const { checkLogin } = require('../middleware.js');

// Validation middleware for review
const validateReview = (req, res, next) => {
    // Validate the incoming review data using the `reviewSchema`
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        // If validation fails, extract error messages and throw an ExpressError
        const errMsg = error.details.map((e) => e.message).join(", ");
        throw new ExpressError(404, errMsg);
    } else {
        // Proceed to the next middleware or route handler if validation succeeds
        next();
    }
};

// POST Route: Add a new review to a listing
router.post(
    "/", // Base path is defined in the parent route (e.g., `/listing/:id/reviews`)
    checkLogin,
    validateReview, // Middleware to validate review data before proceeding
    wrapAsync(async (req, res) => {
        // Find the listing by its ID, passed from the parent route
        const list = await Listing.findById(req.params.id);
        // Create a new Review instance with the submitted review data
        const newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        console.log(newReview);
        // Add the new review to the `reviews` array of the listing
        list.reviews.push(newReview);
        // Save both the review and the updated listing to the database
        await newReview.save();
        await list.save();
        // Log the updated listing (for debugging purposes)
        console.log(list);
        // Redirect back to the listing's details page
        req.flash("success","Review added sucessfully!");
        res.redirect(`/listing/${list._id}`);
    })
);

// DELETE Route: Delete a review from a listing
router.delete("/:Revid", async (req, res) => {
    // Extract `Revid` (review ID) and `id` (listing ID) from the route parameters
    const { Revid, id } = req.params;
    // Update the listing by removing the reference to the review from its `reviews` array
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: Revid } });
    // Delete the review from the `Review` collection in the database
    const com = await Review.findByIdAndDelete(Revid);
    // (Optional) Log the deleted review (for debugging purposes)
    // console.log(com);
    // Redirect back to the listing's details page
    req.flash("success","Review Deleted sucessfully!");
    res.redirect(`/listing/${id}`);
});

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
