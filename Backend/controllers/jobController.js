/*this file is used for the functions that handle the logic for the job routes, it will be imported to the 
jobRoutes.js file for use in the main application.*/

const Job = require("../models/Job");

const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find();

        const formattedJobs = jobs.map((job) => ({
            id: job._id.toString(),
            title: job.title,
            company: job.company,
        }));

        res.json(formattedJobs);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch jobs",
        });
    }
};

const addJob = async (req, res) => {
    try {
        const { title, company } = req.body;

        const job = await Job.create({
            title,
            company,
        });/*job.create is a mongoose method that creates a new job document in the database with the 
        title and company */

        res.status(201).json({
            id: job._id.toString(),
            title: job.title,
            company: job.company,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add job",
        });
    }
};

/*this function is used to update a job in the database, it takes the job id from the request parameters and 
the title and company from the request body, it then uses the findByIdAndUpdate method to update the job in the 
database and returns the updated job in the response*/
const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, company } = req.body;

        const updatedJob = await Job.findByIdAndUpdate(
            id,
            {
                title,
                company,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedJob) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        res.json({
            id: updatedJob._id.toString(),
            title: updatedJob.title,
            company: updatedJob.company,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update job",
        });
    }
};

const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedJob = await Job.findByIdAndDelete(id);

        if (!deletedJob) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        res.json({
            message: "Job deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete job",
        });
    }
};

module.exports = {
    getJobs,
    addJob,
    updateJob,
    deleteJob,
};