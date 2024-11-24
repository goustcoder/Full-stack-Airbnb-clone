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
  const newListing = req.body.listing;
  const newList = new Listing(newListing);
  newList.owner = req.user._id;
  await newList.save();
  req.flash("success", "Add a new listing sucessfully!");
  res.redirect("/listing");
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
  const { id } = req.params;

  await Listing.findByIdAndUpdate(id, {
    title: data.title,
    description: data.description,
    image: data.image,
    price: data.price,
    location: data.location,
    country: data.country,
  });
  req.flash("success", "Listing edited sucessfully!");
  res.redirect(`/listing/${id}`);
};

module.exports.destroyListings = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted sucessfully!");
  res.redirect("/listing");
};
