const buttons = document.querySelectorAll(".apply-btn");

buttons.forEach((button) => {/*the => operator is used to define an arrow function, 
which is a concise way to write a function in JavaScript.
The forEach() method is used to iterate over each button in the buttons NodeList. 
For each button, an event listener is added to listen for the "click" event. 
When a button is clicked, the provided arrow function will be executed.*/
    button.addEventListener("click", (event) => {/*The event object gives you information about the
event that happened — including which element triggered the event.*/
/*The addEventListener() method is used to attach an event handler to the button element. 
In this case, it listens for the "click" event. When the button is clicked, the provided 
arrow function will be executed.*/

        const jobCard = event.target.closest(".job-card");/*even target is the element that 
        triggered the event, which in this case is the button that was clicked., so that clicking
        the button will not trigger the event on the job card itself. The closest() method is
        used to find the nearest ancestor element (including the button itself) that matches the 
        specified selector, which is ".job-card" in this case. This allows you to get the job card 
        element that contains the clicked button.*/

        console.log(jobCard);

    });
});

const jobs = [];

const form = document.querySelector("#job-form");/*querySelector() is a method 
that allows you to select the first element in the document that matches a
specified CSS selector. In this case, it is selecting the form element with 
the id "job-form".*/
const titleInput = document.querySelector("#job-title");
const companyInput = document.querySelector("#job-company");
const jobList = document.querySelector("#job-list");

form.addEventListener("submit", (event) => {/*event is an object that represents the event 
    that occurred. In this case, it is the "submit" event of the form.*/
    event.preventDefault();

    const newJob = {
        title: titleInput.value,/*value is a property of input elements that represents 
        the current value entered by the user.*/
        company: companyInput.value
    };

    jobs.push(newJob);

    const jobCard = document.createElement("article");/*create Element() is a method that 
    creates a new HTML element specified by the tag name passed as an argument. In this case, 
    it creates a new <article> element to represent a job card.*/

    jobCard.classList.add("job-card");

    jobCard.innerHTML = `
        <div>
            <h2>${newJob.title}</h2>
            <p>${newJob.company}</p>
        </div>
    `;

    jobList.appendChild(jobCard);/*appendChild() is used to add a new 
    child element/node inside another HTML element.*/

    form.reset();/*It simply resets the form fields to their initial/default 
    values.*/
    /*reset() is a method that can be called on a form element to reset all the input fields within
    that form to their default values.*/
});