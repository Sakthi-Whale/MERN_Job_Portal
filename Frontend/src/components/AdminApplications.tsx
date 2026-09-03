/*this file is used to display the applications submitted for a specific job by users*/

import type { JobApplication } from "../types";

interface AdminApplicationsProps {
    applications: JobApplication[];
    onBackToJobs: () => void;
}

function AdminApplications({
    applications,
    onBackToJobs
}: AdminApplicationsProps) {
    return (
        <section className="applications-container">

            <div className="applications-header">

                <div>
                    <h2>Job Applications</h2>

                    <p>
                        Applications submitted for this job.
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

            {applications.length === 0 ? (

                <div className="empty-applications">

                    <h3>No applications found</h3>

                    <p>
                        No users have applied for this job yet.
                    </p>

                </div>

            ) : (

                <div className="applications-list">

                    {applications.map((application) => (

                        <article
                            className="application-card"
                            key={application._id}
                        >

                            <div className="application-info">

                                <h3>{application.user.name}</h3>

                                <p>{application.user.email}</p>

                            </div>

                            <span className="application-status">
                                Applicant
                            </span>

                        </article>

                    ))}

                </div>

            )}

        </section>
    );
}

export default AdminApplications;