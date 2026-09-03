/*here we are creating a middleware function called adminMiddleware 
that will check if the user is an admin or not.
 If the user is not an admin then it will return 403 error with 
 message "Access Denied" coz only admins have access to this route */

function adminMiddleware(req, res, next) {

    if (req.user.role !== "admin") {

        return res.status(403).json({
            success: false,
            message: "Access Denied"
        });

    }

    next();

}

module.exports = {
    adminMiddleware
};