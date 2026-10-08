# MERN Job Portal

A full-stack job portal built using the MERN stack and containerized with Docker. This project was developed as a practical learning project to understand full-stack development, authentication, role-based access control, REST APIs, database integration, containerized application deployment, and Kubernetes orchestration.

---

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
- Kubernetes
- Nginx
- Kubernetes Services
- Kubernetes Deployments
- ConfigMaps
- Secrets
- PersistentVolumeClaims
- Liveness / Readiness Probes
- Resource Requests / Limits
- Docker Networking
- Persistent Storage
- Container Healthchecks

---

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

---

# Dockerized Architecture

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

---

## Docker Services

The application uses three Docker Compose services:

* **frontend** — React production build served through Nginx
* **backend** — Node.js/Express REST API
* **mongo** — MongoDB database

The services communicate through the Docker Compose network using service names.

The backend connects to MongoDB using:

```text
mongodb://mongo:27017/ai-job-portal
```

MongoDB data is stored in a persistent Docker volume so that database data remains available even when the MongoDB container is recreated.

---

## Nginx Reverse Proxy

The frontend container uses Nginx to serve the React production build and forward API requests to the backend container.

```text
Browser
   │
   ├── /users/* ──────► Backend
   │
   └── /api/* ────────► Backend
```

This allows the browser to communicate with the backend through the frontend's exposed port without directly exposing MongoDB.

---

# Kubernetes Deployment

The application was also deployed locally on Kubernetes using Docker Desktop Kubernetes.

The Kubernetes deployment uses separate Deployments and Services for the frontend, backend, and MongoDB.

## Kubernetes Architecture

```text
                         Browser
                            │
                            ▼
                   Frontend Service
                    NodePort :30080
                            │
                            ▼
                   Frontend Deployment
                        1 replica
                            │
                            ▼
                    Backend Service
                     ClusterIP :5000
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
        Backend Pod    Backend Pod    Backend Pod
         Replica 1      Replica 2      Replica 3
              └─────────────┼─────────────┘
                            ▼
                    MongoDB Service
                     ClusterIP :27017
                            │
                            ▼
                       MongoDB Pod
                            │
                            ▼
                       MongoDB PVC
                          1Gi
```

## Kubernetes Resources

The Kubernetes deployment contains:

* Frontend Deployment
* Frontend NodePort Service
* Backend Deployment with 3 replicas
* Backend ClusterIP Service
* MongoDB Deployment
* MongoDB ClusterIP Service
* MongoDB PersistentVolumeClaim
* Backend ConfigMap
* Backend Secret
* Liveness and readiness probes
* CPU and memory requests/limits

### Kubernetes Manifest Files

```text
k8s/
├── backend-configmap.yaml
├── backend-deployment.yaml
├── backend-secret.yaml
├── backend-service.yaml
├── frontend-deployment.yaml
├── frontend-service.yaml
├── mongo-deployment.yaml
├── mongo-pvc.yaml
└── mongo-service.yaml
```

---

## Docker Compose

The complete application can be started using Docker Compose.

### Start the application

```bash
docker compose up -d --build
```

### Check running services

```bash
docker compose ps
```

### View logs

```bash
docker compose logs
```

For a specific service:

```bash
docker compose logs backend
docker compose logs frontend
docker compose logs mongo
```

### Stop the application

Stops and removes the containers while preserving the MongoDB volume:

```bash
docker compose down
```

The MongoDB data is stored in the persistent Docker volume and is not removed when the containers are stopped or recreated.

---

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

---

## Docker Healthcheck

MongoDB includes a Docker healthcheck to verify that the database is ready.

The backend depends on MongoDB becoming healthy before the backend service starts.

This helps prevent the backend from attempting to connect to MongoDB before the database is ready.

---

# Kubernetes Validation

The Kubernetes deployment was tested for:

* Frontend accessibility
* Frontend → Backend communication
* Backend → MongoDB communication
* User authentication and login
* Backend Pod self-healing
* Automatic replacement of deleted Pods
* EndpointSlice updates after Pod replacement
* Service-based communication using Kubernetes DNS
* MongoDB persistence using a PersistentVolumeClaim
* MongoDB inspection using `kubectl` and MongoDB Compass
* Liveness and readiness probe configuration
* CPU and memory resource requests and limits

### Pod Self-Healing Validation

The backend Deployment was configured with 3 replicas.

When one backend Pod was manually deleted, Kubernetes automatically created a replacement Pod.

The new Pod received a new IP address, and the Backend Service's EndpointSlice was automatically updated with the new Pod endpoint.

This demonstrated Kubernetes desired-state reconciliation and Pod self-healing.

### MongoDB Persistence Validation

MongoDB was deployed with a PersistentVolumeClaim:

```text
MongoDB Pod
     │
     ▼
mongo-pvc
     │
     ▼
1Gi persistent storage
```

The database was also inspected from MongoDB Compass through a temporary Kubernetes port-forward.

MongoDB remained internal to the Kubernetes cluster through its ClusterIP Service rather than being exposed using NodePort.

For local inspection, port forwarding can be used:

```bash
kubectl port-forward service/mongo 27018:27017
```

MongoDB Compass can then connect using:

```text
mongodb://localhost:27018
```

---

## Project Structure

```text
MERN-stack-AI_Job_Stack/
│
├── Backend/
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
├── k8s/
│   ├── backend-configmap.yaml
│   ├── backend-deployment.yaml
│   ├── backend-secret.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── mongo-deployment.yaml
│   ├── mongo-pvc.yaml
│   └── mongo-service.yaml
│
├── docker-compose.yml
├── docker-compose.env.example
├── .gitignore
└── README.md
```

---

# Running the Application with Docker

### 1. Clone the repository

```bash
git clone https://github.com/Sakthi-Whale/MERN_Job_Portal.git
```

### 2. Navigate to the project

```bash
cd MERN_Job_Portal
```

### 3. Create the Docker environment file

```bash
copy docker-compose.env.example docker-compose.env
```

`docker-compose.env` contains the local runtime configuration and is ignored by Git, while `docker-compose.env.example` is the safe template committed to the repository.

Configure the required environment variables.

### 4. Create the external MongoDB volume

```bash
docker volume create jobportal-mongo-data
```

This is required because `jobportal-mongo-data` is defined as an external Docker volume in `docker-compose.yml`.

### 5. Build and start the application

```bash
docker compose up -d --build
```

### 6. Access the application

Frontend:

```text
http://localhost:8080
```

Backend:

```text
http://localhost:5000
```

MongoDB is intentionally not exposed directly to the host. It is accessible internally by the backend through the Docker network.

---

# Running the Application with Kubernetes

The Kubernetes manifests are located in the `k8s/` directory.

### 1. Apply the Kubernetes resources

```bash
kubectl apply -f k8s/
```

### 2. Check the Deployments

```bash
kubectl get deployments
```

### 3. Check the Pods

```bash
kubectl get pods
```

### 4. Check the Services

```bash
kubectl get svc
```

### 5. Check the MongoDB PVC

```bash
kubectl get pvc
```

### 6. Access the frontend

The frontend is exposed through a Kubernetes NodePort:

```text
NodePort: 30080
```

For local development and testing, the frontend can also be accessed through port forwarding:

```bash
kubectl port-forward service/frontend 8080:80
```

Then open:

```text
http://localhost:8080
```

### 7. Inspect MongoDB locally

MongoDB is kept as a ClusterIP Service and is not directly exposed outside the Kubernetes cluster.

For local database inspection:

```bash
kubectl port-forward service/mongo 27018:27017
```

MongoDB Compass can then connect using:

```text
mongodb://localhost:27018
```

---

# Docker Concepts Practiced

This project was used to practically understand and implement:

* Docker images and containers
* Dockerfiles
* Multi-stage Docker builds
* Docker Compose
* Container networking
* Service-name based communication
* Persistent Docker volumes
* Environment variables
* `.dockerignore`
* Container healthchecks
* Service dependencies
* Nginx reverse proxy
* Production frontend builds

---

# Kubernetes Concepts Practiced

This project was also used to practically understand and implement:

* Kubernetes Deployments
* ReplicaSets and Pod self-healing
* Kubernetes Pods
* Kubernetes Services
* ClusterIP
* NodePort
* Kubernetes DNS-based service communication
* EndpointSlices
* ConfigMaps
* Secrets
* PersistentVolumeClaims
* Dynamic storage provisioning
* Liveness probes
* Readiness probes
* CPU and memory requests
* CPU and memory limits
* Rolling updates
* Container orchestration
* Desired-state reconciliation

---

# Learning Outcome

Through this project, I gained practical experience in taking a full-stack MERN application and containerizing its individual components into a multi-container application using Docker and Docker Compose.

The project also provided hands-on experience with container networking, persistent database storage, environment-based configuration, healthchecks, service dependencies, and reverse proxy configuration using Nginx.

The application was then deployed locally on Kubernetes using Deployments, Services, ConfigMaps, Secrets, PersistentVolumeClaims, liveness/readiness probes, resource requests/limits, and replica-based self-healing.

This provided practical experience with container orchestration, service discovery, persistent storage, application health management, and Kubernetes workload management.

---

# Future Improvements

Planned improvements include:

* AWS / cloud deployment
* CI/CD pipeline implementation
* Automated testing
* Production monitoring and logging
