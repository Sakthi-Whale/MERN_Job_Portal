# Stage 1: Build the React application
FROM node:24 AS build

# Set the working directory inside the Docker container
WORKDIR /app

# Copy package files first
# This allows Docker to cache the dependency installation layer
COPY package*.json ./

# Install the exact dependencies from package-lock.json
RUN npm ci

# Copy the remaining frontend source code
COPY . .

# Create the production build
# This generates the dist/ folder
RUN npm run build


# Stage 2: Serve the production build using Nginx
FROM nginx:alpine

# Copy the production files generated in Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom Nginx configuration
# This configuration allows Nginx to forward API requests to the backend container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx listens on port 80
EXPOSE 80

# Keep Nginx running in the foreground
# Otherwise the container would exit after starting Nginx
CMD ["nginx", "-g", "daemon off;"]