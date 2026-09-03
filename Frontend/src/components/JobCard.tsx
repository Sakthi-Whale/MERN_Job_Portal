/*this file is used to displays one job + handles delete */

import { useState } from "react";
import type { Job } from "../types";/*here we are importing the Job interface from the 
types.ts file to use it in the JobCard component.*/

interface JobCardProps {
    job: Job;/*here we are defining the JobCardProps interface with a single property job 
    of type Job.*/
    onDeleteJob: (jobId: string) => void;
    onUpdateJob: (job: Job) => void;
    onApplyJob: (jobId: string) => void;
    onViewApplications: (jobId: string) => void;
    role: string;
}

function JobCard({ job, onDeleteJob, onUpdateJob, onApplyJob, onViewApplications, role }: JobCardProps) {/*here we are defining the JobCard component that 
    takes a job prop of type JobCardProps. {job} is destructured from the props object 
    to access the job properties directly.*/

    const [isEditing, setIsEditing] = useState(false);/*here we are defining a state variable isEditing and a 
    function setIsEditing to update its value.*/

    const [title, setTitle] = useState(job.title);/*here we are defining a state variable title and a function 
    setTitle to update its value. The initial value of title is set to the job title passed as a prop.*/

    const [company, setCompany] = useState(job.company);/*here we are defining a state variable company and a 
    function setCompany to update its value. The initial value of company is set to the job company passed as a 
    prop.*/


    /*(event: React.FormEvent<HTMLFormElement>) means that the event parameter is of type 
    React.FormEvent<HTMLFormElement>, which is a generic type that represents a form submission event in React. 
    The HTMLFormElement type is used to specify that the event is coming from a form element.*/
    const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const updatedJob: Job = {
            id: job.id,
            title: title,
            company: company,
        };

        onUpdateJob(updatedJob);

        setIsEditing(false);
    };

    return (
        <article className="job-card">

            {isEditing ? (

                <form
                    className="job-edit-form"
                    onSubmit={handleUpdate}
                >

                    <input
                        className="job-edit-input"
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Job title"
                        required
                    />

                    <input
                        className="job-edit-input"
                        type="text"
                        value={company}
                        onChange={(event) => setCompany(event.target.value)}
                        placeholder="Company"
                        required
                    />

                    <div className="job-edit-actions">

                        <button
                            className="save-btn"
                            type="submit"
                        >
                            Save
                        </button>

                        <button
                            className="cancel-btn"
                            type="button"
                            onClick={() => {
                                setTitle(job.title);
                                setCompany(job.company);
                                setIsEditing(false);
                            }}
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            ) : (

                <>
                    <div className="job-info">

                        {/*here we are defining a div element with the class 
                        name job-info that contains the job title and company name.*/}

                        <h2>{job.title}</h2>

                        <p>{job.company}</p>

                    </div>

                    {role === "user" && (
                        <button
                            className="apply-btn"
                            type="button"
                            onClick={() => onApplyJob(job.id)}
                        >
                            {/*here we are defining a button element with the type button and an onClick event handler that calls the onApplyJob function with the job id as an argument. 
                            This allows the user to apply for a job from the list. and the function is exported to app.tsx*/}

                            Apply Now

                        </button>
                    )}

                    {role === "admin" && (
                        <div className="admin-job-actions">

                            <button
                                className="edit-btn"
                                type="button"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </button>

                            <button
                                className="delete-btn"
                                type="button"
                                onClick={() => onDeleteJob(job.id)}
                                /*here we are defining a button element with the type button and an onClick event 
                                handler that calls the onDeleteJob function with the job id as an argument. This allows the 
                                user to delete a job from the jobs state variable. and the function is exported to app.tsx*/
                            >
                                Delete
                            </button>

                            <button
                                className="view-applications-btn"
                                type="button"
                                onClick={() => onViewApplications(job.id)}
                            >
                                View Applications
                            </button>

                        </div>
                    )}
                </>

            )}

        </article>
    );
}

export default JobCard;