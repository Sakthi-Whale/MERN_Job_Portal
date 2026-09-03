type JobStatus = "active" | "closed" | "draft";/*here we are using union type
to define the possible values for the status of a job.*/

interface Job {
    readonly id: string;/*here id is readonly because it should not be 
    changed once the job is created*/
    title: string;
    company: string;
    location: string;
    description: string;
    status: JobStatus;
    salary?: number;
}

const jobs: Job[] = [];/*here we are creating an array of jobs to store the
job objects.*/

const newJob: Job = {
    id: "JOB001",
    title: "AI Engineer",
    company: "ABC Technologies",
    location: "Coimbatore",
    description: "Build AI and machine learning solutions.",
    status: "active",
    salary: 600000
};

jobs.push(newJob);

console.log(jobs);