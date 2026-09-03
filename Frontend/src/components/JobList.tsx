/*this file is used to display a list of jobs and loop through them */

import type { Job } from "../types";
import JobCard from "./JobCard";

interface JobListProps {
    jobs: Job[]; /* Here we are defining the JobListProps interface with a single property
    jobs of type Job[]. */
    onDeleteJob: (jobId: string) => void;
    onUpdateJob: (job: Job) => void;
    onApplyJob: (jobId: string) => void;/*void means that the function does not return any value. 
    The onApplyJob function takes a jobId of type string as an argument and does not return anything. */
    onViewApplications: (jobId: string) => void;
    role: string; /* Here we are defining the JobListProps interface with a single property
    role of type string. */
}

function JobList({ jobs, onDeleteJob, onUpdateJob, onApplyJob, onViewApplications, role }: JobListProps) {
    return (
        <main className="jobs-container">
            {/*
                map() is used to iterate over the jobs array and create
                a JobCard component for each job object.
            */}
            {jobs.map((job) => (
                <JobCard
                    key={job.id}
                    /*
                        The key prop uniquely identifies each JobCard
                        component when React renders the list.
                    */
                    job={job}
                    /*
                        Here we are passing the current job object
                        as a prop to the JobCard component.
                    */
                    onDeleteJob={onDeleteJob}
                    /* 
                        Here we are passing the onDeleteJob function as a prop to the 
                        JobList component from app.tsx. This allows the JobCard component to call the 
                        onDeleteJob function when the delete button is clicked. 

                        the function is defined in App.tsx, while JobList and JobCard access that function 
                        through props. This is another example of parent-to-child communication in React.
                    */
                    onUpdateJob={onUpdateJob}

                    onApplyJob={onApplyJob}

                    onViewApplications={onViewApplications}

                    role={role}
    
                />
            ))}
        </main>
    );
}

export default JobList;