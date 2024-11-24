const Listing = require('./models/listing')



const checkLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
       
        req.session.redirectURL = req.originalUrl;

        console.log(req.session);
        req.flash('error', 'User must be logged in!');
        return res.redirect('/login'); // Ensure you return to stop execution here
    }
    next(); // Only call next() if the user is authenticated
};

const saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectURL) {
        res.locals.redirectURL = req.session.redirectURL; // Fix typo: RedirectURL -> redirectURL
      
    }
    next();
};

const isOwner =async (req,res,next)=>{
    const { id } = req.params;
    
    const listing_owner = await Listing.findById(id);
    console.log(res.locals.currUser._id);
    console.log(listing_owner.owner._id);
   

    if (!res.locals.currUser || !listing_owner.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "Oops! You are not the owner!");
        return res.redirect(`/listing/${id}`);
      }
      
  next();
    
}



// Export both functions as properties of an object
module.exports = { checkLogin, saveRedirectUrl,isOwner };
