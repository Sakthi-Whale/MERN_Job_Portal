/* express importing statement with alias name express require("express")
and const eexpress is variable that stores the express module */
const express = require("express");

/* express() is a function that creates an express application in this line we are acquiring the 
application object and storing it in a variable called app */
const app = express();
/*Execution:
1. require("express") returns the Express function.
2. We store that function in express.
3. We call express().
4. express() returns an Express application object.
5. We store that object in app.*/

/*here we are importing the userRoutes.js file which contains the routes*/
const userRoutes = require("./routes/userRoutes");

/* app.use() is a method that mounts middleware functions at the specified path.
and express.json() is a built-in middleware function in Express that parses 
incoming requests with JSON payloads and is based on body-parser. 
It is used to handle JSON data sent in the request body. */
app.use(express.json());


/*as we dont have a database we are using a temporary database to store the users
 data in the form of an array of objects.*/
// Temporary Database
const users = [];



/* app.get() is a method that defines a route handler for GET requests to the 
root URL ("/"). "/" is the root route of the application, which is
 commonly used as the home page.. req and res are request and response 
which handle the incoming request and outgoing response respectively. */
// Home Route
app.get("/", (req, res) => {
    console.log("Request received!");
    res.send("Hello, Sakthivel!");
});

/*this is same as above but we are defining a route handler for GET requests 
to the "/about" URL.*/
// About Route
app.get("/about", (req, res) => {
    res.send("About Page");
});


/* this line is to  show users data in the form of an array of objects. 
Each object represents a user with properties such as id, name, email, 
and password.*/
// Get All Users
app.get("/users", (req, res) => {
    return res.status(200).json(users);
});


/* app.post() is a method that defines a route handler for POST requests to the
"/register" URL. It is used to handle user registration requests.
it will store the user data in the request body and also checking email
is already registered */
// Register Route
app.post("/register", (req, res) => {

    if (req.body.name === "") {
        return res.status(400).json({
            success: false,
            message: "Name should not be empty"
        });
    }
      const existingUser = users.find(
        user => user.email === req.body.email
    );

    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "Email already exists"
        });
    }

    users.push(req.body);

    return res.status(201).json({
        success: true,
        message: "User Registered"
    });

});/*register route is used to handle user registration requests. 
It checks if the name field in the request body is empty. 
If it is empty, it responds with a 400 status code and 
a JSON object indicating failure. If the name is provided,
 it responds with a 201 status code and a JSON object indicating successful 
 registration.*/


 // Update User
// ===============================
/*beelow block of code is used to update the user data based on the user id.
It first checks if the user with the specified id exists in the users array. 
If the user is not found, it responds with a 404 status code and a JSON object
 indicating failure*/
app.put("/users/:id", (req, res) => {
    const user = users.find(
        user => user.id === Number(req.params.id)
    );

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    user.name = req.body.name;
    user.email = req.body.email;

    return res.status(200).json({
        success: true,
        message: "User Updated Successfully"

    });

});


// Delete User
// ===============================
/*this block of code is used to delete a user based on the user id.
It first checks if the user with the specified id exists in the users array. 
If the user is not found, it responds with a 404 status code and a JSON object*/
app.delete("/users/:id", (req, res) => {
    const index = users.findIndex(
        user => user.id === Number(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    users.splice(index, 1);
    return res.status(200).json({
        success: true,
        message: "User Deleted Successfully"
    });
});


/*we aree suing the route with variable name wwe gave when we importing*/
/*app.use(userRoutes); means Attach all the routes inside userRoutes.js to my 
application*/ 
app.use("/users",userRoutes);


/* app.listen() is a method that starts the server and listens for incoming
requests on the specified port (3000 in this case). port is used to specify 
the port number the server will listen on port 3000 
for example : http://localhost:3000 the user can only access the server through 
this URL */
/*we are inserting the console log statement to indicate that the server is running and listening on port 3000.
This message will be displayed in the terminal when the server starts successfully*/
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});


