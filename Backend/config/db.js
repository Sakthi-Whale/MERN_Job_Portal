/*this file is used to connect to the MongoDB database using Mongoose. It exports a function that establishes 
the connection and handles any errors that may occur during the process.*/

const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed");
        console.error(error.message);

        process.exit(1);
    }
}

module.exports = connectDB;