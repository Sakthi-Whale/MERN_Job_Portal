/*this file is used to display the applications submitted by the logged in user*/

import type { Application } from "../types";

interface MyApplicationsProps {
    applications: Application[];
    onBackToJobs: () => void;
}/*here we are defining the MyApplicationsProps interface with a single property
applications of type Application[].*/

function MyApplications({
    applications,
    onBackToJobs
}: MyApplicationsProps) {
    const activeApplications = applications.filter(
        (application) => application.job !== null
    );/*here we are filtering the applications to keep only the applications whose
    associated job still exists. If an admin has removed a job, the job value will
    be null and that application will not be displayed.*/

    return (
        <section className="applications-container">

            <div className="applications-header">

                <div>
                    <h2>My Applications</h2>

                    <p>
                        Jobs you have applied for.
                    </p>
                </div>

                <button
                    className="back-to-jobs-btn"
                    type="button"
                    onClick={onBackToJobs}
                >
                    Back to Jobs
                </button>

            </div>

            {activeApplications.length === 0 ? (
                <div className="empty-applications">

                    <h3>No applications found</h3>

                    <p>
                        No jobs are applied or applied job is removed by admin.
                    </p>

                </div>
            ) : (
                <div className="applications-list">

                    {activeApplications.map((application) => (
                        <article
                            className="application-card"
                            key={application._id}
                        >

                            <div className="application-info">

                                <h3>{application.job.title}</h3>

                                <p>{application.job.company}</p>

                            </div>

                            <span className="application-status">
                                Applied
                            </span>

                        </article>
                    ))}

                </div>
            )}

        </section>
    );
}

export default MyApplications;