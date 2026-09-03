import { StrictMode } from "react";/*StrictMode is a wrapper component that helps to identify 
potential problems in an application.*/
import { createRoot } from "react-dom/client";/*createRoot is a function that creates a root 
for rendering a React application.*/
import App from "./App";
import "./index.css";
import "./style.css";

createRoot(document.getElementById("root")!).render(/*document.getElementById("root")! 
    means that we are getting the root element from the HTML document and using the non-null 
    assertion operator (!) to tell TypeScript that the element will not be null. .render() is 
    a method that renders the React application*/
    <StrictMode>
        <App />{/*here we are rendering the App component inside the StrictMode 
        wrapper component.*/}
    </StrictMode>
);

/*so in this file we are creating a root for the React application and rendering the App 
component inside the StrictMode wrapper component. so that we can identify potential problems 
in the application.*/
/*we will create element in the html file with id root and we will render the react 
application inside that element.*/
/*pipeline will index.html file and will create a div with id root , main.tsx file will get 
that element and will render the react application inside that element.*/
/*index.html->div id=root->main.tsx->App.tsx->JobForm.tsx, JobList.tsx*/