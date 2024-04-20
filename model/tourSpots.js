const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
        url: String,
        filename: String
});

// https://res.cloudinary.com/dvvubs2ng/image/upload/v1713037220/IndiCamp/q9bhm7csdc32ndcdg2da.jpg

imageSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload", "/upload/w_200");
})

const tourSpotsSchema= new Schema({
    title: String, 
    images: [imageSchema],
    description: String,
    location:String,
    coordinates:{
        type: [Number],
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    totalRating: {
        type: Number,
        required: true,
    },
})

module.exports= mongoose.model("tourSpots", tourSpotsSchema);