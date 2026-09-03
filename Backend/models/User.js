/*here we are importing the mongoose library which is an Object Data 
Modeling (ODM) library for MongoDB and Node.js. It provides a
 straight-forward, schema-based solution to model your a
 pplication data. It includes built-in type casting, validation, query 
 building, business logic hooks and more, out of the box.*/

const mongoose = require("mongoose");

/*here we are defining the schema for the user model which will be
 used to create user documents*/
const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },/*we are uniique the email field because we don't want to have duplicate 
    email addresses in the database.*/
    /*unique: true creates a unique index in MongoDB, which prevents 
    duplicate values.*/


    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        default: "user"
    }/*we have role field in the user schema which will be used to define the 
    role of the user.*/
},
{
    timestamps: true/*timestamp is usedf to automatically add createdAt and 
    updatedAt fields to the user documents.*/
});

module.exports = mongoose.model("User", userSchema);

/*when we create the model User using mongoose.model() method, it
will create a collection named users in the MongoDB database.*/
module.exports = mongoose.model("User", userSchema);/*here we are exporting 
the user model which will be used to create user documents in the users
 collection in the MongoDB database.*/

 /*schema is a blueprint for the data that we want to store in the database.
 amd model is a constructor function that we can use to create new documents 
  /*here User is the model that interacts with the database and userschema
  is the schema.*/