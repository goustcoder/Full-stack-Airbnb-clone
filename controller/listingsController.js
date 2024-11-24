const Listing = require("../models/listing");
const renderStars = require("../middleware")
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.newListingfrom = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.newListingadding = async (req, res) => {
  try {
    // Get the image URL and filename from the uploaded file
    const { path: url, filename } = req.file;

    // Extract the listing details from the form submission
    const newListing = req.body.listing;

    // Create a new Listing instance
    const newList = new Listing(newListing);

    // Set the owner of the listing (assuming the user is logged in)
    newList.owner = req.user._id;

    // Set the image object with url and filename
    newList.image = { url, filename };

    // Save the new listing to the database
    await newList.save();

    // Send success message and redirect
    req.flash("success", "Added a new listing successfully!");
    res.redirect("/listing");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to add the listing.");
    res.redirect("/listing");
  }
};


module.exports.showListings = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing doesn't exists ");
    res.redirect("/listing");
  }

  res.render("listings/show", { listing, renderStars });
};

module.exports.editListingsFrom = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing doesn't exists ");
    res.redirect("/listing");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.editListings = async (req, res) => {
  const { id } = req.params; // Extract listing ID from route parameters
  const data = req.body; // Retrieve data from the request body

  try {
    await Listing.findByIdAndUpdate(id, {
      title: data.title,
      description: data.description,
      image: data.image,
      price: data.price,
      location: data.location,
      country: data.country,
    });
    req.flash("success", "Listing edited successfully!");
    res.redirect(`/listing/${id}`);
  } catch (error) {
    console.error("Error updating listing:", error);
    req.flash("error", "Failed to edit the listing.");
    res.redirect(`/listing/${id}`);
  }
};

module.exports.destroyListings = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted sucessfully!");
  res.redirect("/listing");
};
