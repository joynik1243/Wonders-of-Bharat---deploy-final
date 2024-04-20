const express = require("express");
const router = express.Router();
const catchAsync= require("../utils/catchAsync");
const ExpressError= require("../utils/ExpressError");
const {isLoggedIn, isLoggedInReturnTo, isAuthor, validateTourSpotData, deleteAssociatedDataWithTourSpot, addCoordinates } = require("../middleware");
const tourSpotsHandler = require("../controller/tourSpotsHandler");
const {storage} = require("../cloudinary");
const multer = require("multer");
const upload = multer({storage}); // this is where it stores the incoming files


router.route("/")
    .get( catchAsync(tourSpotsHandler.index))
    .post( isLoggedIn, upload.array("image"), validateTourSpotData, addCoordinates, catchAsync(tourSpotsHandler.createTourSpot));


router.get("/new", isLoggedInReturnTo, tourSpotsHandler.renderNewForm);


router.route("/:id")
.delete( isLoggedIn, isAuthor, deleteAssociatedDataWithTourSpot, catchAsync(tourSpotsHandler.deleteTourSpot))
.get( catchAsync(tourSpotsHandler.showTourSpot))
.put( isLoggedIn, isAuthor, upload.array("image"), validateTourSpotData ,addCoordinates, catchAsync(tourSpotsHandler.editTourSpot))

router.get("/:id/edit", isLoggedInReturnTo, isAuthor,  catchAsync(tourSpotsHandler.renderTourSpotEditPage));



module.exports = router;


