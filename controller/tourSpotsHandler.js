const ExpressError= require("../utils/ExpressError"); 
const {tourSpotSchemaSchema, reviewSchema}= require("../validationSchema/validation");
const tourSpots = require("../model/tourSpots");
const Review = require("../model/review");
const {cloudinary} = require("../cloudinary");


module.exports.index = async (req, res)=>{
    // console.log(req.session);
    // console.log("Get route getting all Tourist Spots.....>");
    const allSpots= await tourSpots.find({});
    res.render("./tourSpots/index.ejs", {allSpots, pageTitle: "All Tourist Spots"});
    // console.log("still going ...........>");
}

module.exports.renderNewForm = (req, res)=>{
    return res.render("tourSpots/new", {pageTitle: "Add New Tourist Spot"});
}

module.exports.createTourSpot = async (req, res)=>{
    const tourSpot = new tourSpots(req.body.tourSpot);
    tourSpot.images=[];
    for(let file of req.files){
        tourSpot.images.push({
            url: file.path,
            filename: file.filename
        });
    }
    tourSpot.totalRating = 0;
    tourSpot.author = req.user._id;
    await tourSpot.save();
    // console.log(tourSpot);
    req.flash("success", `Successfully made a new Tourist Spot!`);
    return res.redirect(`/tourSpots/${tourSpot._id}`);
}

module.exports.deleteTourSpot = async(req, res)=>{
    const {id}= req.params;
    const tourSpot = await tourSpots.findByIdAndDelete(id);
    req.flash("success", `Successfully Deleted ${tourSpot.title} Tourist Spot!` )
    return res.redirect("/tourSpots");
}

module.exports.showTourSpot = async(req, res)=>{
    // console.log("Get route - showing Tourist Spot with id............---->>>>>");
    const id= req.params.id;
    const tourSpot = await tourSpots.findById(id).populate({path:"reviews", populate:{path: "author"}}).populate("author");
    if(!tourSpot){
        req.flash("error", "Tourist Spot Not Found");
        return res.redirect("/tourSpots");
    }
    console.log(tourSpot.title);
    return res.render('tourSpots/show', {tourSpot, pageTitle: tourSpot.title});
}

module.exports.renderTourSpotEditPage = async(req, res)=>{
    // console.log("Get route - Edit Page.........>");
    // console.log(req.session);
    const id = req.params.id;
    const tourSpot = await tourSpots.findById(id);
    if(!tourSpot){
        req.flash("error", "Tourist Spot Not Found!");
        return res.redirect("/tourSpots");
    }
    return res.render("tourSpots/edit", {tourSpot, pageTitel: "Edit Tourist Spot"}); 
}

module.exports.editTourSpot = async (req, res)=>{
    // console.log("Put route - Editing Tourist Spot data..........>");
    const id= req.params.id;
    const tourSpot= await tourSpots.findByIdAndUpdate(id, {...req.body.tourSpot}, {new:true});
    if(req.body.deleteImages){
        await tourSpot.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
        for(filename of req.body.deleteImages){
            cloudinary.uploader.destroy(filename);
        }
    }
    for(let file of req.files){
        tourSpot.images.push({url: file.path, filename: file.filename});
    }
    await tourSpot.save();
    req.flash("success", "Success: Tourist Spot data Edited.");
    return res.redirect(`/tourSpots/${id}`);
    
}

