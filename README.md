# SRE Assignment - Project Setup

## 📁 Project Structure
```
sre-assignment/
├── docker-compose.yml          # Main orchestration file
│── index.html               # System init script
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

# 2. Make scripts executable
chmod +x db/init-db.sh init.sh


# 3. run the project

./init.sh

```
4. Access the Application

    Client (Frontend): http://localhost:8080

    API (Backend): http://localhost:3000

## How It Works

### Docker compose

the compose file start the backend, frontend, kafka, consumer and the tidb services including the CDC neccessary components.
- The TiDB has an init container that waits for the Tidb to load and then runs a bash script to create the required database, tables for users and tokens, and a deafult user with the credentials.

```txt
"email": "user@example.com", "password": "pass123"
```

then through the init script, it exec into the itcdc container to configure the changefeed to sink to kafka

```bash
docker exec -it helfy-ticdc-1 /cdc cli changefeed create   --pd=http://pd:2379   --sink-uri="kafka://kafka:9092/tidb_cdc?protocol=canal-json"   --changefeed-id="kafka"
```

### Client

A static index.html is served by an Nginx container to sends requests to the backend.

Path: /client/index.html

### API

A node.js app that integrates with the DB and frontend through RestAPI

### Consumer

A node.js app that logs database changes through messages receviced from Kafka

### Kafka

receives DB changes meesages from TiDB

### TiDB

SQL Database to save users and tokens
includes CDC to log database changes

---


## Example

After running 
```./init.sh ```
1. access http://localhost:8080
2. enter the credentails ``` "email": "user@example.com", "password": "pass123" ```
3. you will get a token as a response from the tidb database

for example
```
		{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzU0MzQ2NTg1LCJleHAiOjE3NTQzNTAxODV9.Zndy9J65mCcsoqjJF1j2NVIeLqS8t6KR9Df2M6iAB1w"
}
Profile:
{
  "id": 1,
  "email": "user@example.com"
}
```

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
- See Kafka topic of the CDC
``` bash
docker exec -it helfy-kafka-1 bash
kafka-topics --bootstrap-server localhost:9092 --list

#see messages received from TiCDC

kafka-console-consumer --bootstrap-server localhost:9092 --topic  tidb_cdc

```

- See console logs of consumer
```bash
docker logs helfy-consumer-1
```

for the defaukt user you will see something like:
```bash
[2025-08-04T22:58:27.511] [INFO] default - {"timestamp":"2025-08-04T22:58:27.511Z","topic":"tidb_cdc","partition":0,"offset":"3","key":"","value":"{\"id\":0,\"database\":\"app\",\"table\":\"users\",\"pkNames\":[\"id\"],\"isDdl\":false,\"type\":\"INSERT\",\"es\":1754348302899,\"ts\":1754348305814,\"sql\":\"\",\"sqlType\":{\"id\":4,\"email\":12,\"password\":12},\"mysqlType\":{\"id\":\"int\",\"email\":\"varchar\",\"password\":\"varchar\"},\"old\":null,\"data\":[{\"id\":\"1\",\"email\":\"user@example.com\",\"password\":\"pass123\"}]}"}

```

- Enter TiDB to look at data
```bash

mysql -h 127.0.0.1 -P 4000 -u root
```

```sql
SHOW databases;
use app;
SHOW tables;
```
---
# CleanUp
```
docker compose down -v
```

