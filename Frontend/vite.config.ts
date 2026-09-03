import { defineConfig } from "vite";/*defineConfig is a function that allows you to define 
the configuration for Vite, a build tool for modern web projects. It provides a way to 
customize the behavior of Vite during development and production builds.*/
import react from "@vitejs/plugin-react";/*this loads the React plugin for Vite, enabling ]
support for React's JSX syntax and other features.*/

export default defineConfig({
    plugins: [react()],/*here we are using the defineConfig function to define the 
    configuration for Vite.*/
    /*this tells that This project uses React, so process the JSX/TSX files accordingly*/

    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true
            },

            "/users": {
                target: "http://localhost:3000",
                changeOrigin: true/*changeOrigin: true means that the origin of the host header will be 
                changed to the target URL.*/
            }
        }
    }
});/*This section configures the development server for Vite. It sets up a proxy for API requests, so that any 
request to "/api" will be forwarded to "http://localhost:3000". This is useful for development when the 
frontend and backend are running on different ports, allowing the frontend to make API calls without 
running into cross-origin issues. The changeOrigin option is set to true to ensure that the origin of the host 
header is changed to the target URL.*/