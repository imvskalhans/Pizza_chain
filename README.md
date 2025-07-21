# Pizza Chain POS System

A microservices-based POS system for a pizza restaurant chain using Java Spring Boot, and React.

## Services

| Service         | Description                          |
|-----------------|--------------------------------------|
| User Service    | User login, JWT, role management     |
| Order Service   | Order creation, status tracking      |
| Menu Service    | Menu CRUD and customization options  |
| Delivery Service| Delivery tracking & assignment       |
| Inventory       | Ingredient stock tracking            |
| Notification    | Email/SMS notifications              |
| Analytics       | Sales reports and order analytics    |
| Gateway         | Entry point for all services         |
| Registry        | Service discovery (Eureka/Consul)    |

##  Docs

- [Functional_Daigram](docs/PC_Architecture.drawio)

## Tech Stack

- Backend: Spring Boot, JPA, Spring Security, RabbitMQ
- Frontend: React.js, Tailwind
- Messaging: Kafka / RabbitMQ
- Database: PostgreSQL / MySQL
- Deployment: Docker, Kubernetes

##  License
MIT
