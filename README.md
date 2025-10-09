# 🏢 Employee Management System

> A modern, full-stack employee management application with secure JWT authentication, real-time analytics, and interactive organizational hierarchy visualization.

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://your-demo-link.com)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

**[🚀 View Live Demo](https://your-demo-link.com)** | **[📚 Documentation](JWT_AUTHENTICATION.md)** | **[📋 Portfolio Setup Guide](PORTFOLIO_SETUP.md)**

---

## 📸 Screenshots

> 💡 **Note:** Add screenshots here once deployed. Recruiters love visuals!

<!--
![Login Screen](screenshots/login.png)
![Dashboard](screenshots/dashboard.png)
![Analytics](screenshots/analytics.png)
![Org Chart](screenshots/org-chart.png)
-->

---

## ✨ Features

### Core Functionality

- 🔐 **Secure Authentication** - JWT-based auth with password hashing (bcrypt)
- 👥 **Employee Management** - Complete CRUD operations for employee records
- 🔍 **Advanced Search** - Multi-criteria search with real-time filtering
- 📊 **Analytics Dashboard** - Visualize workforce metrics with interactive charts
- 🌳 **Organization Chart** - Interactive hierarchical view of company structure
- 📈 **Performance Tracking** - Employee reviews and performance metrics

### Technical Highlights

- ⚡ **Fast & Responsive** - Optimized Vue 3 with Composition API
- 🛡️ **Security First** - Protected routes, token expiration, auto-logout
- 📱 **Mobile Friendly** - Fully responsive design with Vuetify
- 🔄 **Real-time Updates** - Reactive state management with Pinia
- 🎨 **Modern UI** - Beautiful Material Design interface
- ☁️ **Cloud Ready** - Designed for AWS deployment with horizontal scaling

---

## 🛠️ Tech Stack

### Frontend

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vuetify](https://img.shields.io/badge/Vuetify-3.10-1867C0?logo=vuetify&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-3.0-FFC627?logo=pinia&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5-FF6384?logo=chart.js&logoColor=white)

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe JavaScript for better maintainability
- **Vuetify** - Material Design component framework
- **Pinia** - Intuitive state management
- **Chart.js** - Beautiful data visualizations
- **Vite** - Lightning-fast build tool
- **Zod** - Schema validation
- **VeeValidate** - Form validation

### Backend

![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4.6-47A248?logo=mongodb&logoColor=white)

- **FastAPI** - High-performance Python web framework
- **MongoDB** - Flexible NoSQL database
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **PyJWT** - JSON Web Token implementation
- **Passlib** - Password hashing with bcrypt

### DevOps & Deployment

- **Docker** - Containerization
- **AWS** - Cloud infrastructure (S3, ECS, CloudFront, Secrets Manager)
- **Git** - Version control

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/employee-management-system.git
cd employee-management-system

# Install server dependencies
cd server
pip install -r requirements.txt

# Configure environment
cp env.example .env
# Edit .env and update JWT_SECRET_KEY (generate with: openssl rand -hex 32)

# Install client dependencies
cd ../client
npm install
```

### Running the Application

```bash
# Terminal 1: Start the backend server
cd server
uvicorn app.main:app --reload
# Server runs at http://localhost:8000

# Terminal 2: Start the frontend
cd client
npm run dev
# Client runs at http://localhost:5173
```

### First Time Setup

1. Open `http://localhost:5173` in your browser
2. Click **"Register here"** to create your first account
3. Fill in your details:
   - **Password requirements:** 8+ characters, uppercase, lowercase, and a number
4. You'll be automatically logged in!

> 💡 **Demo Tip:** The app comes with sample employee data. Register and start exploring immediately!

---

## 🎯 Key Highlights

### What This Project Demonstrates

#### 🔒 Security Implementation

- Implemented JWT authentication from scratch (not using auth libraries)
- Password hashing with bcrypt
- Token-based stateless authentication for horizontal scaling
- Protected routes on both client and server
- Automatic token expiration and refresh
- Secure credential storage

#### 🏗️ Architecture & Design

- **Separation of Concerns** - Clean MVC-like architecture
- **RESTful API Design** - Intuitive, well-documented endpoints
- **State Management** - Centralized state with Pinia stores
- **Async Operations** - Proper handling of async/await patterns
- **Error Handling** - Comprehensive error handling with user feedback

#### 💻 Frontend Excellence

- **Vue 3 Composition API** - Modern, maintainable component structure
- **TypeScript** - Full type safety for better DX and fewer bugs
- **Reactive Programming** - Efficient state updates and re-renders
- **Form Validation** - Schema-based validation with Zod
- **Route Guards** - Client-side authentication protection

#### ⚙️ Backend Excellence

- **FastAPI** - Async Python web framework for high performance
- **Type Validation** - Pydantic models for request/response validation
- **Dependency Injection** - Clean, testable code structure
- **Database Design** - Efficient MongoDB schema with proper indexing
- **API Documentation** - Auto-generated with FastAPI (visit `/docs`)

#### ☁️ Cloud-Ready Architecture

- **Stateless Design** - JWT enables horizontal scaling
- **Environment Config** - 12-factor app principles
- **Container Ready** - Docker support included
- **AWS Optimized** - Designed for S3, ECS, CloudFront deployment
- **Secrets Management** - Ready for AWS Secrets Manager

---

## 💡 Technical Challenges Solved

### 1. Authentication System

**Challenge:** Implement secure, production-ready authentication without external auth services.

**Solution:** Built JWT authentication from scratch with:

- Secure password hashing (bcrypt with salt)
- Token generation with expiration
- Automatic token refresh mechanism
- Session persistence across browser refreshes
- Graceful logout on token expiration

### 2. Organizational Hierarchy

**Challenge:** Display complex employee reporting structures in an intuitive way.

**Solution:** Created recursive organization chart component with:

- Dynamic tree traversal
- Visual relationship indicators
- Interactive node expansion/collapse
- Responsive layout for mobile devices

### 3. Real-Time Analytics

**Challenge:** Visualize employee data across multiple dimensions.

**Solution:** Implemented comprehensive analytics with:

- 8 different chart types (line, bar, pie, doughnut)
- Real-time data aggregation
- Performance-optimized rendering
- Responsive chart sizing

### 4. Scalable State Management

**Challenge:** Manage complex application state across many components.

**Solution:** Centralized state management using Pinia with:

- Modular store design (auth, app, dialog, notification)
- Computed properties for derived state
- Action methods for async operations
- Type-safe store access with TypeScript

---

## 📚 Documentation

- **[JWT Authentication Guide](JWT_AUTHENTICATION.md)** - Complete auth implementation details
- **[Quick Start Guide](QUICK_START_JWT.md)** - Get up and running in 5 minutes
- **[Portfolio Setup](PORTFOLIO_SETUP.md)** - Prepare project for recruiters
- **[API Documentation](http://localhost:8000/docs)** - Interactive API docs (when server is running)

---

## 🗂️ Project Structure

```
employee-management-system/
├── client/                    # Vue 3 frontend
│   ├── src/
│   │   ├── components/       # Reusable Vue components
│   │   ├── views/           # Page components
│   │   ├── stores/          # Pinia state stores
│   │   ├── schemas/         # Zod validation schemas
│   │   ├── types/           # TypeScript type definitions
│   │   └── router/          # Vue Router configuration
│   └── package.json
├── server/                   # FastAPI backend
│   ├── app/
│   │   ├── models/          # Pydantic models
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   └── utils/           # Helper functions
│   └── requirements.txt
└── README.md
```

---

## 🔗 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/refresh` - Refresh JWT token

### Employees (Protected)

- `GET /api/employees` - List all employees
- `POST /api/employees` - Create new employee
- `GET /api/employees/{id}` - Get employee by ID
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee
- `POST /api/employees/search` - Advanced search

### Analytics (Protected)

- `GET /api/analytics/performance` - Performance metrics
- `GET /api/analytics/department` - Department statistics
- And more...

**Full API documentation:** `http://localhost:8000/docs`

---

## 🚀 Deployment

### Local Development

See [Quick Start](#-quick-start) above.

### Production Deployment (AWS)

This application is designed for AWS deployment with the following architecture:

```
CloudFront (CDN) → S3 (Static Frontend)
                 ↓
              ALB → ECS Fargate (FastAPI Backend)
                 ↓
              DocumentDB/MongoDB Atlas
```

**Deployment Guide:** See [JWT_AUTHENTICATION.md](JWT_AUTHENTICATION.md#aws-deployment-recommendations) for complete AWS deployment instructions.

**Key Components:**

- Frontend: S3 + CloudFront for global CDN
- Backend: ECS Fargate or AWS App Runner for serverless containers
- Database: MongoDB Atlas (free tier) or AWS DocumentDB
- Secrets: AWS Secrets Manager for JWT keys
- SSL: AWS Certificate Manager for HTTPS

---

## 🧪 Testing

### Manual API Testing

```bash
# Register a new user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","full_name":"Test User"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Get employees (use token from login response)
curl http://localhost:8000/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎯 Future Enhancements

- [ ] Email verification on registration
- [ ] Password reset functionality
- [ ] Multi-factor authentication (MFA)
- [ ] Role-based access control (RBAC)
- [ ] Audit logging system
- [ ] Export to PDF/Excel
- [ ] Advanced reporting
- [ ] Notification system
- [ ] Integration tests
- [ ] CI/CD pipeline

---

## 🤝 About This Project

This Employee Management System was built as a **full-stack portfolio project** to demonstrate modern web development practices, secure authentication implementation, and cloud-ready architecture.

### Why I Built This

I created this project to showcase my ability to:

- ✅ Build complete full-stack applications from scratch
- ✅ Implement security best practices (JWT, password hashing, protected routes)
- ✅ Design scalable, cloud-native architectures
- ✅ Create intuitive, responsive user interfaces
- ✅ Write clean, maintainable, well-documented code
- ✅ Work with modern frameworks and tools

### What I Learned

- **Security:** Implementing JWT authentication, understanding token-based auth vs sessions
- **Architecture:** Designing RESTful APIs, separation of concerns, state management patterns
- **Frontend:** Vue 3 Composition API, TypeScript, reactive programming
- **Backend:** FastAPI async patterns, MongoDB NoSQL design, Pydantic validation
- **DevOps:** Docker containerization, AWS deployment strategies, environment configuration
- **Documentation:** Writing clear technical documentation for different audiences

---

## 👤 Contact & Links

**James Littlefield**

- 🌐 Portfolio: [yourportfolio.com](https://yourportfolio.com)
- 💼 LinkedIn: [linkedin.com/in/yourname](https://linkedin.com/in/yourname)
- 🐙 GitHub: [@yourusername](https://github.com/yourusername)
- 📧 Email: your.email@example.com

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- FastAPI for the excellent Python web framework
- Vue.js team for the amazing frontend framework
- Vuetify for the beautiful Material Design components
- MongoDB for the flexible database solution

---

<div align="center">

**Built with ❤️ by James Littlefield**

⭐ Star this repo if you find it helpful!

</div>
