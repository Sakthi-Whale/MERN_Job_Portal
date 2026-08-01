/*here we are going to create a middleware for authentication*/
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {

    const authHeader = req.headers.authorization;/*here we are getting the
     authorization header from the request headers*/

    if (!authHeader) {/*if there is no authorization header in the request 
        then we will return 401 error*/

        return res.status(401).json({
            success: false,
            message: "Token Missing"
        });

    }
    
const token = authHeader.split(" ")[1];/*here we are splitting the authorization header to get the token
    because the authorization header is in the format of "Bearer <token>"*/

try {/*here we are using try catch block to catch any error that may
     occur while verifying the token*/

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET/*here we are using the JWT_SECRET 
        from the .env file to verify the token*/
    );

    req.user = decoded;/*here we are adding the decoded user information to the 
    request object user coz user will be used in the controller to get the user 
    information Because user is a commonly accepted convention used in Express
     applications*/
    
    next();/*next() is used to pass the control to the next middleware function
      or controller in the stack*/
}
catch (error) {/*catch block will be executed if there is an error 
    while verifying the token*/
    if (error.name === "TokenExpiredError") {

        return res.status(401).json({
            success: false,
            message: "Token Expired"
        });/*here we are checking if the error is a TokenExpiredError
        using error.name and if it is then we will return 401 error with message
        "Token Expired"*/

    }
    return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });
}
}
module.exports = authMiddleware;/*here we are exporting the authMiddleware 
function*/