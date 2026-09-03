/*this file owns the jobs state */

import Register from "./components/Register";/*here we are importing the Register component from the components 
folder. This component will be used to render the registration form when the user is not authenticated.*/

import Login from "./components/Login";/*here we are importing the Login component from the components folder. 
This component will be used to render the login form when the user is not authenticated.*/

import { useEffect, useState } from "react";/*use state is used to store the jobs state and useEffect is used to 
fetch the jobs from the backend API when the component mounts.*/

import { jwtDecode } from "jwt-decode";/*here we are importing the jwtDecode function from the jwt-decode library. 
This function will be used to decode the JWT token and extract the user information from it.*/

import MyApplications from "./components/MyApplications";/*here we are importing the MyApplications showing function 
from MyApplications.tsx*/

import AdminApplications from "./components/AdminApplications";/*here we are importing the adminapplications.tsx function from 
components*/

import type { Application, Job, JobApplication } from "./types";
import JobForm from "./components/JobForm";
import JobList from "./components/JobList";
import {
    addJob,
    getJobs,
    deleteJob,
    updateJob,
    applyForJob,
    getMyApplications,
    getApplicationsForJob
} from "./services/jobService";

interface JwtPayload {
    id: string;
    email: string;
    role: string;
}


function App() {

    const [token, setToken] = useState(/*we are setting the initial value of the token state 
        variable to the value stored in localStorage under the key "token".*/
        localStorage.getItem("token")
    );

    const [applications, setApplications] = useState<Application[]>([]);/*here we are add this state to hold the applications returned by
    "GET /api/applications/my-applications" and it follows the application interface for data entering from types.tz*/

    const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);/*state for admin to see the applications for each job*/

    const [adminApplicationsJobId, setAdminApplicationsJobId] = useState<string | null>(
        sessionStorage.getItem("adminApplicationsJobId")
    );/*here we are adding a state to store the jobid of the job where the admin is looking in session storage */

    const [role, setRole] = useState("");/*here we are using the useState hook to create a state variable role and a function 
to update it. The initial value of role is an empty string.*/

    const [showAdminApplications, setShowAdminApplications] = useState(false);/*this decides whether to show admin level applications or not */

    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            const decoded = jwtDecode<JwtPayload>(storedToken);
            setRole(decoded.role);
        }
    }, []);

    const [showRegister, setShowRegister] = useState(false);/*here we are setting the initial 
    value of the showRegister state variable to false. This will control whether the registration 
    form is displayed or not.*/


    const [showApplications, setShowApplications] = useState(
        sessionStorage.getItem("showApplications") === "true"
    );/*here we are setting the initial 
    value of the showApplications state variable based on the value stored in sessionStorage. The 
    stored value is compared with the string "true", which results in a boolean value of true or 
    false. This state controls whether the My Applications section is visible.*/


    const handleLogin = (newToken: string) => {
        setToken(newToken);/*here we are updating the token state variable with the new token*/

        const decodedToken = jwtDecode<JwtPayload>(newToken);/*here we are decoding the new token 
        using the jwtDecode function and specifying the JwtPayload interface as the expected 
        structure of the decoded token.*/
        
        setRole(decodedToken.role);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");/*here we are removing the token from localStorage when the user logs out. This will prevent the user from 
    accessing protected routes without logging in again.*/
        sessionStorage.removeItem("showApplications");
        sessionStorage.removeItem("adminApplicationsJobId");/*here we are removing the showApplications and adminApplicationsJobId from sessionStorage 
        when the user logs out. This will prevent the user from seeing the applications section without logging in again.*/

        setToken(null);
        setRole("");
        setShowApplications(false);
        setShowAdminApplications(false);
        setAdminApplicationsJobId(null);/*here we are setting the adminApplicationsJobId state variable to null when the user logs out. This will 
        prevent the admin from seeing the applications for a specific job without logging in again.*/
    };


    const [jobs, setJobs] = useState<Job[]>([]);/*useState<Job[]>([]) means that we are 
        using the useState hook to create a state variable jobs and a function to update it. 
        The initial value of the jobs state variable is an empty array of type Job[].*/

    const [loading, setLoading] = useState(false);/*useState(false) means that we are using the 
    useState hook to create a state variable loading and a function to update it. The initial 
    value of the loading state variable is false.*/

    const [error, setError] = useState("");/*useState("") means that we are using the useState 
    hook to create a state variable error and a function to update it. The initial value of the error 
    state variable is an empty string.*/


    /*useEffect(() => {...}, []); means that we are using the useEffect hook to perform a side effect 
    (fetching jobs from the backend API) when the component mounts. The [] at the end means the effect 
    runs after the initial render, rather than after every state update.*/
    useEffect(() => {
        const loadJobs = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getJobs();
                setJobs(response.data);
            } catch (error) {
                console.error("Failed to load jobs:", error);
                setError("Failed to load jobs.");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            loadJobs();
        }
    }, [token]);
    

    /*same use effect logic as above for getting user level application for respective user */
    useEffect(() => {
        const loadApplications = async () => {
            try {
                if (!token || role !== "user") {
                    return;
                }

                const response = await getMyApplications(token);
                setApplications(response.data.applications);

            } catch (error) {
                console.error("Failed to load applications:", error);
            }
        };

        loadApplications();
    }, [token, role]);


    useEffect(() => {
        const loadAdminApplications = async () => {
            try {
                if (!token || role !== "admin" || !adminApplicationsJobId) {
                    return;
                }

                const response = await getApplicationsForJob(
                    adminApplicationsJobId,
                    token
                );

                setJobApplications(response.data.applications);
                setShowAdminApplications(true);

            } catch (error: any) {
                console.error("Failed to load admin applications:", error);

                setShowAdminApplications(false);
                setAdminApplicationsJobId(null);
                sessionStorage.removeItem("adminApplicationsJobId");

                setError(
                    error.response?.data?.message ||
                    "Failed to load applications."
                );
            }
        };

        loadAdminApplications();
    }, [token, role, adminApplicationsJobId]);/*above we have added a separate useEffect for admin application seeing to overcome refresh problem */


    const handleAddJob = async (newJob: Job) => {
        /*setJobs([...jobs, newJob]);...jobs, newJob means that we are creating a new array 
    that contains all the existing jobs in the jobs state variable and adding the new job 
    object to it. ...jobs is the spread operator that expands the existing jobs array.*/

        try {
            setError("");/*here we are resetting the error state variable to an empty string before
        making the API call to add a new job. This is done to clear any previous error messages 
        that may have been displayed to the user.*/

            const response = await addJob(newJob);

            setJobs((previousJobs) => [...previousJobs, response.data]);/*here we are using the functional form of 
        setJobs to update the jobs state variable. instead of the above line 'setJobs([...jobs, response.data]);'
        we are using a callback function that takes the previous state (previousJobs) as an argument and 
        get data from the response and returns a new array that contains all the previous jobs and the newly 
        added job.*/

        } catch (error) {
            console.error("Failed to add job:", error);
            setError("Failed to add job.");
        }
    };


    const handleDeleteJob = async (jobId: string) => {/*jobId: string means that we are defining a function 
        handleDeleteJob that takes a jobId parameter of type string. This function will be used to delete a job 
        from the jobs state variable.*/
        
        /*setJobs(jobs.filter((job) => job.id !== jobId));filter() creates a new array that 
        contains all the jobs except the job whose id matches the jobId.*/
        try {
            setError("");

            await deleteJob(jobId);

            setJobs((previousJobs) => previousJobs.filter((job) => job.id !== jobId));/*here we are using the 
        functional form of setJobs to update the jobs state variable.
        instead of the above line 'setJobs(jobs.filter((job) => job.id !== jobId));' we are using a callback 
        function that takes the previous state (previousJobs) as an argument and returns a new array that 
        contains all the previous jobs except the job whose id matches the jobId. This is a safer way to 
        update the state when the new state depends on the previous state.*/
        
        } catch (error) {
            console.error("Failed to delete job:", error);
            setError("Failed to delete job.");
        }
    };


    const handleUpdateJob = async (updatedJob: Job) => {
        try {
            setError("");

            const response = await updateJob(updatedJob.id, updatedJob);

            setJobs((previousJobs) =>
                previousJobs.map((job) =>
                    job.id === updatedJob.id ? response.data : job
                )/*above part means Go through all existing jobs. If the job's ID matches the updated job's ID, 
            replace it with the updated job. Otherwise, keep the existing job unchanged.*/
            );
        } catch (error) {
            console.error("Failed to update job:", error);
            setError("Failed to update job.");
        }
    };


    const handleApplyJob = async (jobId: string) => {
        try {
            setError("");

            if (!token) {
                setError("Please login to apply for a job.");
                return;
            }

            const response = await applyForJob(jobId, token);

            alert(response.data.message || "Application submitted successfully.");

            /*here we are updating the applications state immediately after a successful
            application so that the newly submitted application appears in My Applications
            without requiring a page refresh*/
            const applicationsResponse = await getMyApplications(token);

            setApplications(applicationsResponse.data.applications);

        } catch (error: any) {
            console.error("Failed to apply for job:", error);
            
            setError(
                error.response?.data?.message || 
                
                "Failed to apply for job."
            );
        }
    };


    const handleViewApplications = async (jobId: string) => {
        try {
            setError("");

            if (!token) {
                setError("Please login to view applications.");
                return;
            }

            const response = await getApplicationsForJob(jobId, token);/*the function will retrieve the applications 
        for the job using its jobID*/

            console.log("Applications response:", response.data);

            setJobApplications(response.data.applications);

            setAdminApplicationsJobId(jobId);/*here we are adding the jobid of job where the admin is looking to avoid the refresh problem*/
            sessionStorage.setItem("adminApplicationsJobId", jobId);


            setShowAdminApplications(true);/*here we are changing the state to true so that the 
        AdminApplications component will be displayed for the selected job*/

        } catch (error: any) {
            console.error("Failed to load applications:", error);
            console.error("Status:", error.response?.status);
            console.error("Response:", error.response?.data);

            if (error.response?.status === 401) {
                setError("Your session has expired. Please login again.");
            } else if (error.response?.status === 403) {
                setError("You do not have permission to view applications.");
            } else {
                setError("Unable to load applications. Please try again.");
            }
        }
    };


    return (
        <>
            {!token ? (
                showRegister ? (
                    <>
                        <Register />

                        {/*here we are setting the onClick event handler for the button. 
                    false means that when the button is clicked, the showRegister 
                    state variable will be set to false, which will hide the registration form and show the 
                    login form instead.*/}

                        <button
                            type="button"
                            onClick={() => setShowRegister(false)}
                        >
                            Back to Login
                        </button>
                    </>
                ) : (
                    <>
                        <Login onLogin={handleLogin} />

                        <button
                            type="button"
                            onClick={() => setShowRegister(true)}
                        >
                            Create an account
                        </button>
                    </>
                )
            ) : (
                <>
                    <header className="app-header">

                        <div className="app-header-content">

                            <div className="app-logo">
                                <h1>Job Portal</h1>
                                <span>
                                    {role === "admin"
                                        ? "Admin Dashboard"
                                        : "Find Your Next Opportunity"}
                                </span>
                            </div>

                            <nav className="app-nav">

                                {role === "user" && (
                                    <button
                                        className="nav-button"
                                        type="button"
                                        onClick={() => {
                                            setShowApplications(true);
                                            setShowAdminApplications(false);
                                            sessionStorage.setItem("showApplications", "true");
                                        }}
                                    >
                                        My Applications
                                    </button>
                                )}

                                <button
                                    className="logout-button"
                                    type="button"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>

                            </nav>

                        </div>

                    </header>

                    {role === "admin" && !showAdminApplications && !showApplications && (
                        <JobForm onAddJob={handleAddJob} />
                    )}

                    {loading && <p>Loading jobs...</p>}
                    {error && <p>{error}</p>}

                    {/*above part means If loading is true, display "Loading jobs...". If there's an error 
        message, display it.*/}

                    {/*
            here we are passing the handleDeleteJob 
            function as a prop to the JobList component
        */}

                    {!showApplications && !showAdminApplications && (
                        <JobList
                            jobs={jobs}
                            onDeleteJob={handleDeleteJob}
                            onUpdateJob={handleUpdateJob}
                            onApplyJob={handleApplyJob}
                            onViewApplications={handleViewApplications}
                            role={role}
                        />
                    )}

                    {role === "user" && showApplications && (
                        <MyApplications
                            applications={applications}
                            onBackToJobs={() => {
                                setShowApplications(false);
                                setShowAdminApplications(false);
                                sessionStorage.removeItem("showApplications");
                            }}
                        />
                    )}

                    {role === "admin" && showAdminApplications && (
                        <AdminApplications
                            applications={jobApplications}
                            onBackToJobs={() => {
                                setShowAdminApplications(false);
                                setAdminApplicationsJobId(null);
                                sessionStorage.removeItem("adminApplicationsJobId");
                            }}
                        />
                    )}
                </>
            )}
        </>
    );
}

export default App;