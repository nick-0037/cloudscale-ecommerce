# 🚀 CloudScale E-commerce

> A high-performance, scalable microservices architecture for modern e-commerce platforms, focused on performance and reliability.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Consul](https://img.shields.io/badge/Consul-FF4088?style=for-the-badge&logo=hashicorp-consul&logoColor=white)
![ELK Stack](https://img.shields.io/badge/ELK_Stack-005571?style=for-the-badge&logo=elastic-stack&logoColor=white)

## 📖 Overview

CloudScale E-commerce is a distributed system designed for massive scalability. It leverages a microservices architecture where each service is isolated, independent, and communicates through standard protocols. With integrated service discovery via Consul and centralized logging via the ELK stack, it provides a production-ready environment for modern e-commerce needs.

## ✨ Key Features

- **🏗️ Microservices Architecture:** Decoupled services for `user-service` and `product-service`.
- **📡 Service Discovery:** Dynamic service registration and health checking using HashiCorp Consul.
- **📊 Centralized Logging:** Real-time log aggregation and visualization using Elasticsearch, Logstash, and Kibana (ELK).
- **🗄️ Type-Safe ORM:** Leveraging Drizzle ORM for performant, type-safe database interactions and easy migrations.
- **🛠️ Shared Utilities:** A core `@cloudscale/shared` package to maintain DRY principles across the monorepo.
- **🐳 Containerized Ecosystem:** Fully dockerized services for consistent development and deployment flows.
- **🛡️ Clean Architecture:** Separation of concerns between controllers, services, and data access layers.

---

## 🛠️ Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/) (v20+)
- **Language:** TypeScript
- **Web Framework:** Express
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Service Discovery:** [Consul](https://www.consul.io/)
- **Observability:** ELK Stack (Logstash, Elasticsearch, Kibana)
- **Package Manager:** [pnpm](https://pnpm.io/)

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- [pnpm](https://pnpm.io/) (v9+)

### 1. Environment Setup

Copy the example environment file and fill in your details:

```bash
cp .env.example .env
```

### 2. Launch Infrastructure

Spin up all microservices and infrastructure (Postgres, Consul, ELK):

```bash
docker compose up -d --build
```

### 3. Local Development

To run services locally with live-reload:

```bash
pnpm install
pnpm dev
```

---

## 🔌 Service Ports

| Service           | Port   | Description                        |
| :---------------- | :----- | :--------------------------------- |
| `user-service`    | `3000` | User management and authentication |
| `product-service` | `3001` | Product catalog and inventory      |
| `consul`          | `8500` | Service discovery UI               |
| `kibana`          | `5601` | Log visualization dashboard        |

---

## 👨‍💻 Architecture Highlights

- **Service Factory:** Uses a standardized factory pattern to bootstrap Node.js services with pre-configured middleware and service discovery.
- **Logstash Transport:** The `@cloudscale/shared` logger streams logs directly to Logstash for centralized analysis.
- **Database Isolation:** Each microservice maintains its own dedicated PostgreSQL instance to ensure data autonomy.

---

_Built with ❤️ for high-scale e-commerce._
