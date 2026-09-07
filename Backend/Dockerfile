# FROM node: 24 means that the Docker image will be built using the official Node.js version 24 image as the base image. 
# This image includes Node.js and npm, which are necessary for running a Node.js application.
FROM node:24 


#WORKDIR /app sets the working directory inside the Docker container to /app.
WORKDIR /app

# The COPY package*.json ./ command copies the package.json and package-lock.json files from the host machine to the working directory inside the Docker 
# container. 
COPY package*.json ./

# The RUN npm ci command installs the dependencies listed in the package-lock.json file. and also ensures that the exact versions of the dependencies 
# are installed, which helps to maintain consistency across different environments.It installs dependencies reproducibly from the lock file.
RUN npm ci


# The COPY . . command copies the entire contents of the current directory on the host machine to the working directory inside the Docker container.
COPY . .

# The EXPOSE 5000 instruction informs Docker that the container will listen on port 5000 at runtime.
EXPOSE 5000

# The CMD ["node", "server.js"] instruction specifies the command that will be executed when the Docker container is started.
CMD ["node", "server.js"]