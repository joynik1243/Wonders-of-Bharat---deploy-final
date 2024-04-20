const mongoose= require("mongoose");
const tourSpots = require("../model/tourSpots");
const cities= require("./cities.js");
const {descriptors, places} = require("./seedHelpers.js");

mongoose.connect("mongodb://localhost:27017/WondersOfBharat", {
}).then(()=>{
    console.log("Database Connected");
}).catch((error)=>{
    console.log("There is an Error connecting to Database ", error);
});  

console.log("length of the cities array si ", cities.length);

const indiaCoordinates = [
    { latitude: 28.6139, longitude: 77.2088 }, // Delhi
    { latitude: 17.5117, longitude: 78.1804 }, // Hyderabad
    { latitude: 28.5358, longitude: 77.1284 }, // Noida
    { latitude: 12.9716, longitude: 77.5946 }, // Bangalore
    { latitude: 22.5726, longitude: 88.3639 }, // Kolkata
    { latitude: 11.6667, longitude: 78.1667 }, // Chennai
    { latitude: 26.8500, longitude: 80.9499 }, // Lucknow
    { latitude: 18.5204, longitude: 73.8567 }, // Pune
    { latitude: 23.0225, longitude: 72.5714 }, // Ahmedabad
    { latitude: 31.1466, longitude: 75.7861 }, // Amritsar
    { latitude: 21.1702, longitude: 72.8311 }, // Surat
    { latitude: 19.1156, longitude: 72.8777 }, // Mumbai (Bombay)
    { latitude: 17.3881, longitude: 81.8081 }, // Visakhapatnam
    { latitude: 26.4586, longitude: 85.3230 }, // Patna
    { latitude: 10.8505, longitude: 76.2701 }, // Kochi (Cochin)
    { latitude: 30.3167, longitude: 67.4417 }, // Quetta (historical part of India)
    { latitude: 33.7382, longitude: 73.0842 }, // Islamabad (historical part of India)
    { latitude: 27.2072, longitude: 78.0814 }, // Agra
    { latitude: 22.3027, longitude: 88.3639 }, // Howrah (twin city of Kolkata)
    { latitude: 26.1586, longitude: 91.7789 }, // Guwahati
  ];

async function seedDB(){
    await tourSpots.deleteMany({});
    for(let i=0;i<50;i++){
        const random= Math.random();
        const random1000= Math.floor(random*1000);
        const coordinates = indiaCoordinates[Math.floor(random*20)];

        const tourSpot = new tourSpots({
            author: "66205e77ceb8077ae983e008",
            title: `${descriptors[Math.floor(random*descriptors.length)]} ${places[Math.floor(random*places.length)]}`, 
            images: [{url:`https://source.unsplash.com/collection/483251`, filename: "image"}],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, amet dolores. In aspernatur commodi debitis deserunt, voluptatem alias illum, nisi eius ea quae quidem ratione illo quasi voluptate sed magni. Illo illum exercitationem neque quam. Magnam, esse dolorem nulla libero soluta assumenda, earum quos voluptatem itaque quasi ab consectetur blanditiis maiores officia adipisci modi cumque consequuntur velit incidunt ducimus debitis.",
            price: (Math.round(random*100)/100)*8000 +2000,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            coordinates: [coordinates.latitude, coordinates.longitude],
            reviews:[],
            totalRating: 0

        })
        await tourSpot.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});