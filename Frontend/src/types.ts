/*this file defines the Job types and interfaces */

export interface Job {
    readonly id: string;
    title: string;
    company: string;
}/*here we are defining the Job interface with the properties id, title, and company. 
The id property is marked as readonly to ensure that it cannot be modified after the job 
is created.*/


export interface Application {
    _id: string;
    job: Job;
    user: string;
}/*here we created separate interfaces for user and admin applications to show*/

export interface JobApplication {
    _id: string;
    job: Job;/*here we want full details associated with job so we directly gave that */
    user: {
        name: string;
        email: string;
    };
}/* above is the interface for application*/