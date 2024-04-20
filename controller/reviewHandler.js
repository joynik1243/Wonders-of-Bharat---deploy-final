const ExpressError= require("../utils/ExpressError"); 
const {reviewSchema}= require("../validationSchema/validation");
const tourSpots = require("../model/tourSpots");
const Review = require("../model/review");


module.exports = {
    async postReview(req, res, next){
        // console.log("Post route - posting review.........");
        const {id} = req.params;
        const tourSpot = await tourSpots.findById(id).populate("reviews");

         // Initialize hasReviewed to false
         let hasReviewed = false;

         // Check if user has reviewed
         for (let i = 0; i < tourSpot.reviews.length; i++) {
             if (tourSpot.reviews[i].author.equals(req.user._id)) {
                 hasReviewed = true;
                 break;
             }
         }
         if(hasReviewed){
            req.flash("error", "You have already Reviewed this Tourist Spot!!");
            return res.redirect(`/tourSpots/${id}`);
         }

        const review= new Review(req.body.review);
        tourSpot.totalRating = tourSpot.totalRating + review.rating;
        review.author = req.user._id;
        if(!tourSpot.reviews) tourSpot.reviews= [];
        tourSpot.reviews.push(review);
        await review.save();
        await tourSpot.save();
        console.log("Total Rating is: ", tourSpot.totalRating);
        req.flash("reviewSuccess", "Review Added!");
        res.redirect(`/tourSpots/${id}`);
        
    },
    async deleteReview(req, res, next){
        // console.log("Delete route - Deleting Review.........>");
        const {id, reviewId} = req.params;
        const tourSpot = await tourSpots.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}, {new: true});
        const review = await Review.findByIdAndDelete(reviewId);
        tourSpot.totalRating = tourSpot.totalRating - review.rating;
        tourSpot.save();
        console.log("Total Rating is: ", tourSpot.totalRating);
        req.flash("reviewSuccess", "Review Deleted!");
        res.redirect(`/tourSpots/${id}`);
    }

}