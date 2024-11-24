function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(next);
    }
}

module.exports = wrapAsync;


//wrapasync get the func like this
// async(req,res,next)=>{
  
//     let data=res.body;
//     const newList= new Listing(data.Listing);
//     await newlist.save();
//     res.redirect("/listing");

// })