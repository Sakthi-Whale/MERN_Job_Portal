# MERN Job Portal

A full-stack job portal built using the MERN stack and containerized with Docker. This project was developed as a practical learning project to understand full-stack development, authentication, role-based access control, REST APIs, database integration, and containerized application deployment.

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Axios

### Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication
- bcrypt

### Database
- MongoDB
- Mongoose

### DevOps / Deployment
- Docker
- Docker Compose
- Nginx
- Docker Networking
- Docker Volumes
- Container Healthchecks

## Features

### Authentication
- User registration
- User login
- JWT-based authentication
- Protected routes
- Password hashing using bcrypt

### Role-Based Access Control
- User and Admin roles
- Admin authorization middleware
- Admin-only job management operations

### Job Management
- Create jobs
- View jobs
- Update jobs
- Delete jobs
- Admin-controlled job CRUD operations

### Applications
- Users can apply for jobs
- Application management
- Protected application APIs

## Dockerized Architecture

The application is containerized into separate services:

```text
                    ┌─────────────────────┐
                    │      Browser        │
                    └──────────┬──────────┘
                               │
                               │ :8080
                               ▼
                    ┌─────────────────────┐
                    │ Frontend Container  │
                    │ React + Nginx       │
                    └──────────┬──────────┘
                               │
                         /api /users
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Backend Container   │
                    │ Node.js + Express   │
                    └──────────┬──────────┘
                               │
                         mongodb://mongo
                               │
                               ▼
                    ┌─────────────────────┐
                    │ MongoDB Container   │
                    │       MongoDB       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Persistent Volume   │
                    │ jobportal-mongo-data│
                    └─────────────────────┘
```

### Docker Services

The application uses three Docker Compose services:

- **frontend** — React production build served through Nginx
- **backend** — Node.js/Express REST API
- **mongo** — MongoDB database

The services communicate through the Docker Compose network using service names.

The backend connects to MongoDB using:

```text
mongodb://mongo:27017/ai-job-portal
```

MongoDB data is stored in a persistent Docker volume so that database data remains available even when the MongoDB container is recreated.

### Nginx Reverse Proxy

The frontend container uses Nginx to serve the React production build and forward API requests to the backend container.

```text
Browser
   │
   ├── /users/* ──────► Backend
   │
   └── /api/* ────────► Backend
```

This allows the browser to communicate with the backend through the frontend's exposed port without directly exposing MongoDB.

## Docker Compose

The complete application can be started using Docker Compose.

**Start the application**
```bash
docker compose up -d --build
```

**Check running services**
```bash
docker compose ps
```

**View logs**
```bash
docker compose logs
```

For a specific service:
```bash
docker compose logs backend
docker compose logs frontend
docker compose logs mongo
```

**Stop the application**

Stops and removes the containers while preserving the MongoDB volume:
```bash
docker compose down
```

The MongoDB data is stored in the persistent Docker volume and is not removed when the containers are stopped or recreated.

## Environment Variables

Docker runtime configuration is provided through:

```text
docker-compose.env
```

The file contains environment-specific values such as:

```env
MONGO_URI=mongodb://mongo:27017/ai-job-portal
PORT=5000
JWT_SECRET=your-secret-here
```

The actual `docker-compose.env` file is intentionally excluded from Git using `.gitignore`.

A safe example file is provided as:

```text
docker-compose.env.example
```

Copy the example file and configure the required values before starting the application.

## Healthcheck

MongoDB includes a Docker healthcheck to verify that the database is ready.

The backend depends on MongoDB becoming healthy before the backend service starts.

This helps prevent the backend from attempting to connect to MongoDB before the database is ready.

## Project Structure

```text
MERN-stack-AI_Job_Stack/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── Dockerfile
│   └── .dockerignore
│
├── Frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
│
├── docker-compose.yml
├── docker-compose.env.example
├── .gitignore
└── README.md
```

## Running the Application with Docker

**1. Clone the repository**
```bash
git clone https://github.com/Sakthi-Whale/MERN_Job_Portal.git
```

**2. Navigate to the project**
```bash
cd MERN_Job_Portal
```

**3. Create the Docker environment file**

```bash
copy docker-compose.env.example docker-compose.env
```

`docker-compose.env` contains the local runtime configuration and is ignored by Git, while `docker-compose.env.example` is the safe template committed to the repository.

Configure the required environment variables.

**4. Create the external MongoDB volume**

```bash
docker volume create jobportal-mongo-data
```

This is required because `jobportal-mongo-data` is defined as an external Docker volume in `docker-compose.yml`.

**5. Build and start the application**
```bash
docker compose up -d --build
```

**6. Access the application**

Frontend:
```text
http://localhost:8080
```

Backend:
```text
http://localhost:5000
```

MongoDB is intentionally not exposed directly to the host. It is accessible internally by the backend through the Docker network.

## Docker Concepts Practiced

This project was used to practically understand and implement:

- Docker images and containers
- Dockerfiles
- Multi-stage Docker builds
- Docker Compose
- Container networking
- Service-name based communication
- Persistent Docker volumes
- Environment variables
- .dockerignore
- Container healthchecks
- Service dependencies
- Nginx reverse proxy
- Production frontend builds

## Learning Outcome

Through this project, I gained practical experience in taking a full-stack MERN application and containerizing its individual components into a multi-container application using Docker and Docker Compose.

The project also provided hands-on experience with container networking, persistent database storage, environment-based configuration, healthchecks, and reverse proxy configuration using Nginx.

## Future Improvements

Planned improvements include:

- Kubernetes orchestration
- CI/CD pipeline implementation
- Cloud deployment
- Automated testing
- Production monitoring and logging
