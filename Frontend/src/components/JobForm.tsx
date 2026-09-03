/*this file iss used to create a from for new jobs */

import { useState } from "react";/*here we are importing the useState hook from the react library. The 
useState hook is a function that allows us to add state to functional components in React. It returns an array 
with two elements: the current state value and a function to update it. In this case, we are using 
useState to create state variables for the job title and company name in the JobForm component.*/

import type { Job } from "../types";/*here we are importing the Job type from the types file. 
The Job type is an interface that defines the shape of a job object. It has three properties: id, title, and 
company. The id property is a string that represents the unique identifier for the job. The title property is 
a string that represents the job title. The company property is a string that represents the name of the company 
offering the job. By importing the Job type, we can use it to type-check our code and ensure that we are 
working with job objects that have the correct shape.*/


interface JobFormProps {
    onAddJob: (job: Job) => void; /*here we are defining the JobFormProps interface with a 
        single property onAddJob and void means that the function does not return any value.*/
}

function JobForm({ onAddJob }: JobFormProps) {
    const [title, setTitle] = useState(""); /*here we are using the useState hook to create 
        a state variable title and a function to update it.*/
    const [company, setCompany] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => { /*here we are defining 
        the handleSubmit function that takes an event of type React.FormEvent<HTMLFormElement> 
        as a parameter.*/
        event.preventDefault(); /*here we are preventing the default form submission 
            behavior of reloading the page.*/

        const newJob: Job = {
            id: crypto.randomUUID(), /*here we are generating a unique id for the new 
            job using the crypto.randomUUID() means that we are using the crypto module to 
            generate a random UUID for the new job.*/
            title: title,
            company: company
        };

        /*below we are calling the addJob function and passing the newJob object as a parameter.
        The addJob function sends a POST request to the backend API to add the new job to the database. 
        We are using the await keyword to wait for the promise returned by the addJob function to resolve, 
        and we are storing the response in a variable called response.*/
        /*const response = await addJob(newJob);
        onAddJob(response.data);

        setTitle(""); /*here we are resetting the title and company state variables to empty 
        strings after the form is submitted.*/
        /*setCompany("");*/

        onAddJob(newJob);

        setTitle("");
        setCompany("");
    };

    return (
        <section className="job-form-container">

            <div className="job-form-header">
                <h2>Add New Job</h2>

                <p>
                    Create a new job opportunity for users.
                </p>
            </div>

            <form
                id="job-form"
                className="job-form"
                onSubmit={handleSubmit}
            >
                {/*
                this line is an event 
handler that updates the title state variable whenever the user types in the input field.
                */}
                <input
                    className="job-form-input"
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Job title"
                    required
                />

                {/*
                here event is an object 
    that represents the change event that occurred in the input field.
                */}
                <input
                    className="job-form-input"
                    type="text"
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                    placeholder="Company"
                    required
                />

                {/*
                add job button is used to submit the form and trigger the 
                handleSubmit function.
                */}
                <button
                    className="job-form-button"
                    type="submit"
                >
                    Add Job
                </button>
            </form>

        </section>
    );
}

export default JobForm;