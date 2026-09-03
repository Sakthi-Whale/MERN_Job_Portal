/*
this file is used to handle all API requests related to jobs and job
applications in the frontend application.

It acts as the service layer between the React components and the
backend API by using Axios to send HTTP requests.

It contains functions for adding, retrieving, updating, and deleting
jobs, applying for jobs, retrieving the logged in user's applications,
and retrieving applications submitted for a specific job.
*/

import axios from "axios";/*here we are importing the axios library to make HTTP requests to the backend API.*/
import type { Job } from "../types";/*this line imports the Job interface from the types.ts file to use it in 
the jobService.ts file.*/

export const addJob = async (job: Job) => {
    const token = localStorage.getItem("token");

    return axios.post("/api/jobs", job, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};/*this function takes a job object as an argument and sends a POST request to the /api/jobs endpoint of the 
backend API.*/

export const getJobs = async () => {
    return axios.get<Job[]>("/api/jobs");
};/*this function sends a GET request to the /api/jobs endpoint of the backend API and expects an array of Job 
objects 'Job[]' in response from the backend.*/

export const applyForJob = (jobId: string, token: string) => {
    return axios.post(
        `/api/applications/${jobId}/apply`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};/*this function takes a jobId string and a token string as arguments and sends a POST request to the /api/applications/:jobId/apply endpoint of the 
backend API. The jobId is included in the URL to specify which job to apply for, and the token is included in the request headers for authentication.*/


export const getMyApplications = async (token: string) => {
    return axios.get("/api/applications/my-applications", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};/*the above function is used to connect the backend getmyapplications route with frontend actions using axios sending the http requests*/

export const getApplicationsForJob = async (jobId: string, token: string) => {
    return axios.get(`/api/applications/${jobId}/applications`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};/*the above function is used to connect the backend getApplicationsForJob route with frontend actions using axios sending the http requests. 
The jobId is included in the URL to retrieve applications for a specific job, and the token is included in the request headers for authentication.*/


export const updateJob = async (jobId: string, job: Job) => {
    const token = localStorage.getItem("token");/*this line retrieves the token from localStorage to include it in 
    the request headers for authentication.*/

    return axios.put(`/api/jobs/${jobId}`, job, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};/*this function takes a jobId string and a job object as arguments and sends a PUT request to the /api/jobs/:
jobId*/

export const deleteJob = async (jobId: string) => {
    const token = localStorage.getItem("token");

    return axios.delete(`/api/jobs/${jobId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};/*this function takes a jobId string as an argument and sends a DELETE request to the /api/jobs/:id 
endpoint of the backend API. The jobId is included in the URL to specify which job to delete.*/