const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

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

const checkLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectURL = req.originalUrl;

    console.log(req.session);
    req.flash("error", "User must be logged in!");
    return res.redirect("/login"); // Ensure you return to stop execution here
  }
  next(); // Only call next() if the user is authenticated
};

const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectURL) {
    res.locals.redirectURL = req.session.redirectURL; // Fix typo: RedirectURL -> redirectURL
  }
  next();
};

const isOwner = async (req, res, next) => {
  const { id } = req.params;

  const listing_owner = await Listing.findById(id);
  // console.log(res.locals.currUser._id);
  // console.log(listing_owner.owner._id);

  if (
    !res.locals.currUser ||
    !listing_owner.owner._id.equals(res.locals.currUser._id)
  ) {
    req.flash("error", "Oops! You are not the owner!");
    return res.redirect(`/listing/${id}`);
  }

  next();
};

// Export both functions as properties of an object
module.exports = {
  validateReview,
  validateListing,
  checkLogin,
  saveRedirectUrl,
  isOwner,
  renderStars,
};
