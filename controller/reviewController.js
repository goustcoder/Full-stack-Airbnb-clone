const { reviewSchema } = require("../schema.js"); // Schema for validating review data
const Listing = require("../models/listing.js"); // Listing model to interact with the database
const Review = require("../models/review.js"); // Review model to interact with the database

module.exports.addReview = async (req, res) => {
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
  req.flash("success", "Review added sucessfully!");
  res.redirect(`/listing/${list._id}`);
};

module.exports.destroyReview = async (req, res) => {
  // Extract `Revid` (review ID) and `id` (listing ID) from the route parameters
  const { Revid, id } = req.params;
  // Update the listing by removing the reference to the review from its `reviews` array
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: Revid } });
  // Delete the review from the `Review` collection in the database
  const com = await Review.findByIdAndDelete(Revid);
  // (Optional) Log the deleted review (for debugging purposes)
  // console.log(com);
  // Redirect back to the listing's details page
  req.flash("success", "Review Deleted sucessfully!");
  res.redirect(`/listing/${id}`);
};
