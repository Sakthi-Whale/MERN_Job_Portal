/*this file is used to define the Job model for the database, the structure of each job document that is being 
stored in the MongoDB collection */

/*MongoDB will automatically create an _id for each job. so we don't need to define it in the schema.*/

const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        company: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Job", jobSchema);