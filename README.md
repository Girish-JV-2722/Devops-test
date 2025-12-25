# 🅿️ ParkFlow - Smart Parking Management System

A modern parking management system built with **React** (frontend), **.NET 8** (backend), and deployed using **Docker**.

![ParkFlow](https://img.shields.io/badge/ParkFlow-Parking%20Management-00d4aa?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![.NET](https://img.shields.io/badge/.NET-8-512BD4?style=flat-square&logo=dotnet)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)

## ✨ Features

- **Dashboard** - Real-time overview with occupancy stats and revenue tracking
- **Parking Lot View** - Visual grid of all parking spots by level
- **Park Vehicle** - Select available spots and register vehicles
- **Exit Vehicle** - Process exits with multiple payment methods
- **Ticket Management** - View all active and completed parking tickets
- **Responsive Design** - Works on desktop and mobile devices

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   React App     │────▶│   .NET 8 API    │
│   (Frontend)    │     │   (Backend)     │
│   Port: 3000    │     │   Port: 5000    │
└─────────────────┘     └─────────────────┘
         │                       │
         └───────────────────────┘
                Docker Network
```

## 📁 Project Structure

```
Devops-test/
├── backend/
│   ├── ParkingManagement.API/
│   │   ├── Controllers/          # API endpoints
│   │   ├── Models/              # Data models & DTOs
│   │   ├── Services/            # Business logic
│   │   ├── Data/                # Database context
│   │   └── Program.cs           # Application entry point
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── api.ts               # API client
│   │   └── types.ts             # TypeScript types
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🚀 Quick Start with Docker

### Prerequisites

- [Docker](https://www.docker.com/get-started) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed

### Run the Application

1. **Clone/Navigate to the project directory**
   ```bash
   cd Devops-test
   ```

2. **Build and start containers**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Swagger UI: http://localhost:5000/swagger

4. **Stop the application**
   ```bash
   docker-compose down
   ```

## 💻 Local Development

### Backend (.NET 8)

```bash
cd backend/ParkingManagement.API

# Restore dependencies
dotnet restore

# Run the API
dotnet run

# API will be available at http://localhost:5000
```

### Frontend (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# App will be available at http://localhost:5173
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/parking/dashboard` | Get dashboard statistics |
| GET | `/api/parking/spots` | Get all parking spots |
| GET | `/api/parking/spots/available` | Get available spots |
| GET | `/api/parking/spots/{id}` | Get specific spot |
| POST | `/api/parking/spots` | Create new spot |
| POST | `/api/parking/park` | Park a vehicle |
| POST | `/api/parking/exit` | Exit a vehicle |
| GET | `/api/parking/tickets` | Get all tickets |
| GET | `/api/parking/tickets/active` | Get active tickets |

### Example: Park a Vehicle

```bash
curl -X POST http://localhost:5000/api/parking/park \
  -H "Content-Type: application/json" \
  -d '{"vehiclePlate": "ABC123", "spotId": 1}'
```

### Example: Exit a Vehicle

```bash
curl -X POST http://localhost:5000/api/parking/exit \
  -H "Content-Type: application/json" \
  -d '{"ticketNumber": "TKT-20231225-ABC12345", "paymentMethod": "CreditCard"}'
```

## 🎨 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **.NET 8** - Framework
- **Entity Framework Core** - ORM
- **In-Memory Database** - Data storage (demo)
- **Swagger/OpenAPI** - API documentation

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Static file serving & reverse proxy

## 🔧 Configuration

### Environment Variables

#### Frontend
| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:5000` | Backend API URL |

#### Backend
| Variable | Default | Description |
|----------|---------|-------------|
| `ASPNETCORE_ENVIRONMENT` | `Production` | Environment |
| `ASPNETCORE_URLS` | `http://+:5000` | Listening URL |

## 📊 Database

The application uses an **in-memory database** for demo purposes. It comes pre-seeded with:
- 60 parking spots across 3 levels (A, B, C)
- 5 spot types: Compact, Regular, Large, Handicapped, Electric
- Different hourly rates based on spot type

For production, you can switch to SQL Server by updating the `Program.cs`:

```csharp
builder.Services.AddDbContext<ParkingDbContext>(options =>
    options.UseSqlServer(connectionString));
```

## 🐳 Docker Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up --build -d

# Remove volumes
docker-compose down -v
```

## 📝 License

This project is for educational/demo purposes.

---

Made with ❤️ for DevOps learning

