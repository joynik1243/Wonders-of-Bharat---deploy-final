const tourSpots = require("./model/tourSpots");
const Review = require("./model/review");
const {tourSpotSchema, reviewSchema} = require("./validationSchema/validation");
const {cloudinary} = require("./cloudinary");
const NodeGeocoder = require('node-geocoder');

const geocoder = NodeGeocoder({
  provider: 'opencage',
  apiKey: process.env.OPENCAGE_API_KEY 
});

module.exports.isLoggedInReturnTo = (req, res, next)=>{
    if(!req.isAuthenticated()){ 
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be Signed In first!");
        return res.redirect("/login");
    }
    next();
}

module.exports.isLoggedOut = (req, res, next)=>{
    if(req.isAuthenticated()){
        req.flash("error", "You are already Logged In");
        return res.redirect("/tourSpots");
    }
    next();
}

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){ 
        req.flash("error", "You must be Signed In first!");
        return res.redirect("/login");
    }
    next();
}

module.exports.isAuthor = async (req, res, next)=>{
    const {id} = req.params;
    const tourSpot = await tourSpots.findById(id);
    console.log(req.user._id);
    if(!tourSpot.author.equals(req.user._id) && !req.user.id == process.env.ADMIN_ID){
        req.flash("error", "You are not Authorized.");
        return res.redirect(`/tourSpots/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next)=>{
    const {reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!req.user || (!review.author.equals(req.user._id) && !req.user.id == process.env.ADMIN_ID)){
        req.flash("error", "You are not Authorized.");
        res.redirect(req.originalUrl);
    }
    next();
}

module.exports.validateTourSpotData = (req, res, next)=>{
    
    const {error} = tourSpotSchema.validate(req.body.tourSpot);
    if(error){
        const msg= error.details.map(el=> el.message).join(", ");
        req.flash("error", msg);
        return res.redirect("/tourSpots/new");
    }
    else{
        next();
    }
}

module.exports.deleteAssociatedDataWithTourSpot = async (req, res, next)=>{
    const {id} = req.params;
    const tourSpot = await tourSpots.findById(id);
    const reviews= tourSpot.reviews;
    if(reviews.length>0){
        await Review.deleteMany({_id: { $in: reviews}});
    }
    for(img of tourSpot.images){
        await cloudinary.uploader.destroy(img.filename);
    }
    next();

}

module.exports.validateReviewData = (req, res, next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        let msg= error.details.map(el=> el.message).join(", ");
        req.flash("reviewError", "Review Body required!");
        res.redirect(`/tourSpots/${req.params.id}`);
    }
    else next();
}

module.exports.addCoordinates = async (req, res, next)=>{
    const {location} = req.body.tourSpot;
    try {
        // Geocode by address
        const result = await geocoder.geocode(location);
        let confidence=0;
        const coordinates=[];
        // console.log(result);
        for(let ad of result){
            if(ad.extra.confidence>=confidence){
                confidence= ad.extra.confidence;
                coordinates[0]= ad.latitude;
                coordinates[1] = ad.longitude;
            }
        }
        // console.log("Coordinates from middleware: ", coordinates);
        req.body.tourSpot.coordinates = coordinates;

      } catch (error) {
        console.log('Geocode Error:', error);
        req.flash("error", error.message);
        res.redirect("/tourSpots/new");
      }
      next();
}