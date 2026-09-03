const mongoose = require("mongoose");/*here we are importing the mongoose library which is used to interact with MongoDB database.*/

/*here we are defining the applicationSchema which is a blueprint for the Application model
which will be used to create and manage application documents in the MongoDB database.*/

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,/*type: mongoose.Schema.Types.ObjectId means that the user field will store an ObjectId which 
            is a unique identifier for a document in MongoDB.*/
            ref: "User",
            required: true
        },

        status: {
            type: String,
            default: "Applied"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Application", applicationSchema);