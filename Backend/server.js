/*this tells the server to load environment variables from a .env 
file into process.env*/
require("dotenv").config();

const express = require("express");

/*here we are importing the connectDB function from db.js file in config folder*/
const connectDB = require("./config/db");

const app = express();

/*here we are calling the connectDB function to establish a connection to the
 MongoDB database*/

/*we intentionally called this function here so that the connection 
is established before the server starts listening for requests*/

/*here we are importing the userroutes functions*/
/*we have defined "/users" here so we dont have to 
 denote it in userroutes.js or usercontroller.js files*/
 /*this tells Whenever a request starts with /users, send it to userRoutes.js.*/
const userRoutes = require("./routes/userRoutes");

/*here we are importing the jobroutes functions*/
const jobRoutes = require("./routes/jobroutes");

/*here we are importing the applicationroutes functions*/
const applicationRoutes = require("./routes/applicationRoutes");

app.use(express.json());

/*we have defined "/users" here so we dont have to 
denote it in userroutes.js or usercontroller.js files*/
app.use("/users", userRoutes);

/*we have defined "/jobs" here so we dont have to 
denote it in jobroutes.js or jobcontroller.js files*/
app.use("/api/jobs", jobRoutes);


/*we have defined "/applications" here so we dont have to 
denote it in applicationroutes.js or applicationcontroller.js files*/
app.use("/api/applications", applicationRoutes);

app.get("/", (req, res) => {
    res.send("Hello, Sakthivel!");
});

app.get("/about", (req, res) => {
    res.send("About Page");
});

/*here we are starting the server and listening for requests on the 
port defined in the .env file and we have used the async/await syntax
so that server will start only after the database connection is established*/
async function startServer() {
    await connectDB();/*await tells the server to wait for the database
     connection to be established before starting the server*/

    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}

startServer();