const express = require("express");

const router = express.Router();

const {
    getJobs,
    addJob,
    updateJob,
    deleteJob,
} = require("../controllers/jobcontroller");

/*here we are importing the authMiddleware function from the authMiddleware.js file
which will be used to protect the routes that require authentication. */
const authMiddleware = require("../middlewares/authMiddleware");

/*here we are importing the adminMiddleware function from the adminMiddleware.js file
which will be used to protect the routes that require admin access. */
const { adminMiddleware } = require("../middlewares/adminMiddleware");

router.get("/", getJobs);/*router for getting all jobs data in the form of an array of objects
getJobs is the function that handles the logic for retrieving job data
assigned from the jobController.js file.*/

router.post("/", authMiddleware, adminMiddleware, addJob);/*router for adding a new job in the form of an object
addJob is the function that handles the logic for adding a new job
assigned from the jobController.js file.*/

router.put("/:id", authMiddleware, adminMiddleware, updateJob);/*router for updating a job in the form of an object
updateJob is the function that handles the logic for updating a job
assigned from the jobController.js file.*/

router.delete("/:id", authMiddleware, adminMiddleware, deleteJob);/*router for deleting a job in the form of an object
deleteJob is the function that handles the logic for deleting a job
assigned from the jobController.js file.*/

module.exports = router;