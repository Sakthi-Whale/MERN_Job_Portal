const express = require("express");

const router = express.Router();

const {
    applyForJob,
    getMyApplications,
    getApplicationsForJob
} = require("../controllers/applicationController");

const authMiddleware = require("../middlewares/authMiddleware");

router.post(
    "/:jobId/apply",
    authMiddleware,
    applyForJob
);

router.get(
    "/my-applications",
    authMiddleware,
    getMyApplications
);/*here the route is 'GET /api/applications/my-applications' same for other routes above and below */

router.get(
    "/:jobId/applications",
    authMiddleware,
    (req, res, next) => {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Admin access required"
            });
        }/*above we have defined a middleware function that checks if the user has an admin role. If not, it returns a 403 status code with a message 
        indicating that admin access is required. If the user is an admin, it calls the next() function to proceed to the next middleware or route 
        handler.*/

        next();
    },
    getApplicationsForJob
);

module.exports = router;