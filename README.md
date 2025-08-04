# SRE Assignment - Project Setup

## 📁 Project Structure
```
sre-assignment/
├── docker-compose.yml          # Main orchestration file
│
├── server/                    # Node.js API service
│   ├── Dockerfile
│   ├── package.json
│   ├── app.js
│   └── db.js
│   ├── auth.js
│
├── client/                   # frontend
│   ├── Dockerfile
│   ├── index.html
│   ├── nginx.conf
│ 
│
├── consumer/              # Change Data Capture consumer
│   ├── Dockerfile
│   ├── index.js
│
│
├── db/                   # Database initialization
│   ├── inint-db.sh
│   └── init.sql
```

##  Quick Start

### Prerequisites
- Docker
- Docker compose

### Setup & Run
```bash
# 1. Clone the Repository
git clone https://github.com/yam-devops/helfy-sre-assignment.git
cd helfy-sre-assignment

# 2. Make script executable
chmod +x db/init-db.sh


# 3. run the project

docker-compose up --build

```
4. Access the Application

    Client (Frontend): http://localhost:8080

    API (Backend): http://localhost:3000

## How It Works

### Docker compose

the compose file start the backend, frontend, kafka, consumer and the itdb services.
- The itdb has an init container that waits for the itdb to load and then runs a bash script to create the required database, tables for users and tokens, and a deafult user with the credentials.
```txt
"email": "user@example.com", "password": "pass123"
```

### Client

A static index.html is served by an Nginx container. It contains JavaScript that makes requests to the Flask API.

Path: /client/index.html

### API

A simple Flask app that responds with JSON.

---


## Example

After running ```docker compose up --build ```
1. access localhost:8080
2. enter the credentails ``` "email": "user@example.com", "password": "pass123" ```
3. you will get a token as a response from the itdb database

- You can also inspect the logs of the containers to see the logs of the requests and to troubleshoot

```
docker logs helfy-frontend-1
docker logs helfy-tidb-1
docker logs helofy-backend-1
```
- Send a request with the credentials in a header through CLI:

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "pass123"}'

```

---
# CleanUp
```
docker compose down
```


