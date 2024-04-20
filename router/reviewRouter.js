const express = require("express");
const router = express.Router({mergeParams: true}); // This is important part {mergeParams: true}
const catchAsync= require("../utils/catchAsync");
const ExpressError= require("../utils/ExpressError"); 


const {isLoggedIn, validateReviewData, isReviewAuthor} = require("../middleware");

const reviewHandler = require("../controller/reviewHandler");


router.post("/", isLoggedIn, validateReviewData, catchAsync(reviewHandler.postReview) )

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviewHandler.deleteReview));

module.exports = router;
