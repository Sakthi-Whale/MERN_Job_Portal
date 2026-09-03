const Application = require("../models/Application");
const mongoose = require("mongoose");

async function applyForJob(req, res) {
    try {
        const jobId = req.params.jobId;
        const userId = req.user.id;

        // 1. Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Job ID"
            });
        }

        // 2. Check whether the user has already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            user: userId
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: "You have already applied for this job"
            });
        }

        // 3. Create the application
        const application = await Application.create({
            job: jobId,
            user: userId
        });

        // 4. Return success response
        return res.status(201).json({
            success: true,
            message: "Job application submitted successfully",
            application
        });

    } catch (error) {
        console.error("Apply For Job Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

async function getApplicationsForJob(req, res) {
    try {
        const jobId = req.params.jobId;

        // 1. Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Job ID"
            });
        }

        // 2. Find all applications for this job
        const applications = await Application.find({
            job: jobId
        }).populate("user", "name email");

        // 3. Return applications
        return res.status(200).json({
            success: true,
            applications
        });

    } catch (error) {
        console.error("Get Applications For Job Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


/*the below function getMyApplications retrieves all job applications submitted by the currently authenticated user. 
It uses the user ID from the request object to query the Application model and populate the associated job details. 
If successful, it returns a 200 status code with the applications data. In case of an error, it logs the error and returns a 
500 status code with an error message. */
async function getMyApplications(req, res) {
    try {
        const userId = req.user.id;

        const applications = await Application.find({
            user: userId
        }).populate("job");/*populate is used to retrieve the job details associated with each application. 
        This allows us to get the job information without having to make a separate query for each application.*/

        return res.status(200).json({
            success: true,
            applications
        });

    } catch (error) {
        console.error("Get My Applications Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}




module.exports = {
    applyForJob,
    getMyApplications,
    getApplicationsForJob
};