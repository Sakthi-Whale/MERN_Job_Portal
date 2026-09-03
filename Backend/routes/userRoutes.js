/*here we are creating the routes for the user module
we are not creating a new express app just creating a router
which will do the user related operations*/
const express = require("express");

/* express.Router() is a method that creates a new router object.
A router object is an isolated instance of middleware and routes. 
It can be thought of as a "mini-application" capable only of performing 
middleware and routing functions. */
const router = express.Router();

/*here we are importing the controller functions storedd as objects {} from the usercontroller.js file
which will handle the logic for getting all users data in the form of an array 
of objects.*/
/*{} is used to destructure the object and get the getUsers function from the
userController.js file as we are exporting an object with a getUsers property. */
const{ getUsers,
       registerUser,
       loginUser,
       promoteUser,
       updateUser, 
       deleteUser
    } = require("../controllers/userController");

/*here we are importing the authMiddleware function from the authMiddleware.js file
which will be used to protect the routes that require authentication. */
const authMiddleware = require("../middlewares/authMiddleware");
/*here we are importing the adminMiddleware function from the adminMiddleware.js file
which will be used to protect the routes that require admin access. */
const { adminMiddleware } = require("../middlewares/adminMiddleware");

/*router for registering a new user and it will imported to the
server.js file for use in the main application.*/
router.post("/register", registerUser);
/*router for login user*/
router.post("/login", loginUser);

/*router for getting all users data in the form of an array of objects
getUsers is the function that handles the logic for retrieving user data
assigned from the userController.js file.*/
router.get("/", authMiddleware,adminMiddleware, getUsers);/*here we are adding
 the authMiddleware function as a middleware to the getUsers route to protect 
 it from unauthorized access and also adminMiddleware to allow admin users
  to access it*/


router.put(
    "/:id",
    authMiddleware,
    updateUser
);/*router for updating a user data in the form of an object, 
here there is no adminMiddleware as any user can update their own data 
but not other users data, we inserted admin check in the controller function*/

/*router for promoting a user to admin*/
router.put(
    "/promote/:id",
    authMiddleware,
    adminMiddleware,
    promoteUser
);/*only admin users can promote other users to admin, 
so we added the adminMiddleware function as a middleware to the 
promoteUser route to protect it from unauthorized access.*/

/*router for deleting a user account, here there is adminMiddleware as only 
admin users can delete other users account but not their own account*/
router.delete(
    "/:id",
    authMiddleware,
    deleteUser
);


/*router for registering a new user and it will imported to the
server.js file for use in the main application.*/
module.exports = router;