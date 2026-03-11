# Changisha Bills 🏦

A comprehensive fintech application for bill management and contributions, built with FastAPI backend and React frontend.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Changisha Bills is a modern fintech solution designed to help users:
- Track and manage bills efficiently
- Make contributions towards bill payments
- Set payment reminders
- Analyze spending patterns
- Integrate with M-Pesa for payments

## ✨ Features

### Backend Features
- **🔐 Authentication**: JWT-based authentication with secure token management
- **📊 Bill Management**: CRUD operations for bills with progress tracking
- **💰 Contributions**: Track and manage bill contributions
- **💳 Payment Methods**: Multiple payment method support
- **📱 M-Pesa Integration**: Seamless M-Pesa payment processing
- **🔔 Notifications**: Automated bill reminders and notifications
- **📈 Analytics**: Spending insights and bill analytics
- **🚀 Caching**: Redis-based caching for performance
- **🛡️ Security**: Rate limiting, input validation, and security headers

### Frontend Features
- **🎨 Modern UI**: Beautiful, responsive design with Chakra UI
- **⚡ Performance**: Optimized React with TypeScript and Vite
- **🔄 Real-time Updates**: Live bill progress and contribution tracking
- **📱 Mobile Responsive**: Works seamlessly on all devices
- **🌙 Dark Mode**: Built-in dark/light theme support
- **📊 Dashboard**: Comprehensive analytics and overview
- **🔐 Secure Auth**: Secure authentication flow with token management
- **📝 Forms**: Advanced form validation and error handling

## 🛠️ Tech Stack

### Backend
- **🐍 FastAPI**: Modern, fast web framework for building APIs
- **🗄️ SQLAlchemy**: Powerful SQL toolkit and ORM
- **🗃️ Alembic**: Database migration tool
- **🔐 JWT**: JSON Web Token authentication
- **📱 M-Pesa SDK**: Mobile money integration
- **🧪 Pytest**: Testing framework
- **🐳 Docker**: Containerization
- **🌿 Celery**: Asynchronous task queue
- **📊 Redis**: In-memory data structure store
- **🔧 Pydantic**: Data validation using Python type annotations

### Frontend
- **⚛️ React**: Modern JavaScript library for building user interfaces
- **📘 TypeScript**: Typed JavaScript for better development experience
- **🎨 Chakra UI**: Simple, modular and accessible component library
- **⚡ Vite**: Fast build tool and development server
- **🔄 React Query**: Powerful data fetching and state management
- **🗄️ Zustand**: Small, fast, and scalable state management
- **📝 React Hook Form**: Performant forms with easy validation
- **🔍 Zod**: Schema validation
- **🧪 Vitest**: Fast unit testing framework
- **🐳 Docker**: Containerization

## 📁 Project Structure

```
changisha-bills/
├── changisha_backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── api/v1/                  # API endpoints
│   │   │   ├── auth.py             # Authentication routes
│   │   │   ├── bills.py            # Bill management routes
│   │   │   ├── contributions.py    # Contribution routes
│   │   │   ├── payments.py         # Payment processing
│   │   │   └── payment_methods.py  # Payment method management
│   │   ├── core/                   # Core functionality
│   │   │   ├── config.py           # Application configuration
│   │   │   ├── security.py         # Security utilities
│   │   │   ├── cache.py           # Caching layer
│   │   │   └── logging.py         # Logging configuration
│   │   ├── models/                 # Database models
│   │   │   ├── user.py             # User model
│   │   │   ├── bill.py            # Bill model
│   │   │   ├── contribution.py     # Contribution model
│   │   │   ├── payment.py         # Payment model
│   │   │   └── notification.py    # Notification model
│   │   ├── schemas/                # Pydantic schemas
│   │   ├── services/               # Business logic
│   │   ├── workers/                # Celery tasks
│   │   ├── integrations/           # External integrations
│   │   └── database/              # Database configuration
│   ├── tests/                     # Test suite
│   ├── alembic/                   # Database migrations
│   ├── requirements.txt            # Python dependencies
│   ├── Dockerfile                 # Docker configuration
│   └── docker-compose.yml         # Development environment
└── changisha_frontend/              # React Frontend
    ├── src/
    │   ├── components/             # Reusable components
    │   │   ├── BillCard.tsx       # Bill display component
    │   │   ├── BillFormModal.tsx   # Bill creation/edit form
    │   │   ├── ContributionModal.tsx # Contribution form
    │   │   └── Dashboard.tsx      # Dashboard components
    │   ├── pages/                  # Page components
    │   │   ├── Auth.tsx           # Authentication pages
    │   │   └── Dashboard.tsx      # Main dashboard
    │   ├── services/               # API service layer
    │   │   ├── api-client.ts      # HTTP client configuration
    │   │   ├── auth.service.ts     # Authentication service
    │   │   ├── bill.service.ts     # Bill management service
    │   │   └── ...               # Other services
    │   ├── store/                  # State management
    │   │   ├── auth.store.ts       # Authentication state
    │   │   ├── bill.store.ts       # Bill state
    │   │   └── contribution.store.ts # Contribution state
    │   ├── types/                  # TypeScript type definitions
    │   ├── test/                   # Test files
    │   └── utils/                  # Utility functions
    ├── public/                     # Static assets
    ├── package.json               # Node.js dependencies
    ├── vite.config.ts             # Vite configuration
    ├── tsconfig.json              # TypeScript configuration
    └── Dockerfile                # Docker configuration
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **Docker** and **Docker Compose**
- **PostgreSQL** (or use Docker)
- **Redis** (or use Docker)

### 1. Clone the Repository

```bash
git clone https://github.com/Matsukatm/changisha-bills.git
cd changisha-bills
```

### 2. Backend Setup

```bash
cd changisha_backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
alembic upgrade head

# Start the development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup

```bash
cd changisha_frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start the development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## ⚙️ Environment Setup

### Backend Environment Variables (.env)

```env
# Database
DATABASE_URL=postgresql://username:password@localhost/changisha_bills

# JWT
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# M-Pesa
MPESA_CONSUMER_KEY=your-mpesa-consumer-key
MPESA_CONSUMER_SECRET=your-mpesa-consumer-secret
MPESA_PASSKEY=your-mpesa-passkey
MPESA_SHORTCODE=your-mpesa-shortcode

# Redis
REDIS_URL=redis://localhost:6379

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Application
DEBUG=True
ENVIRONMENT=development
```

### Frontend Environment Variables (.env.local)

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Changisha Bills
VITE_APP_VERSION=1.0.0
```

## 📚 API Documentation

### Authentication Endpoints

```http
POST /api/v1/auth/register     # User registration
POST /api/v1/auth/login        # User login
POST /api/v1/auth/logout       # User logout
GET  /api/v1/auth/me          # Get current user
```

### Bill Management Endpoints

```http
GET    /api/v1/bills           # Get all bills
POST   /api/v1/bills           # Create new bill
GET    /api/v1/bills/{id}      # Get specific bill
PUT    /api/v1/bills/{id}      # Update bill
DELETE /api/v1/bills/{id}      # Delete bill
GET    /api/v1/bills/{id}/progress # Get bill progress
```

### Contribution Endpoints

```http
GET    /api/v1/contributions           # Get all contributions
POST   /api/v1/contributions           # Create contribution
GET    /api/v1/contributions/bill/{id}  # Get contributions for specific bill
POST   /api/v1/contributions/summary   # Get contribution summary
```

### Payment Endpoints

```http
POST   /api/v1/payments/stkpush       # Initiate M-Pesa payment
GET    /api/v1/payments/{id}          # Get payment details
GET    /api/v1/payments/              # Get all payments
```

For detailed API documentation, visit: http://localhost:8000/docs

## 🧪 Testing

### Backend Testing

```bash
cd changisha_backend

# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py
```

### Frontend Testing

```bash
cd changisha_frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## 🚀 Deployment

### Docker Deployment (Recommended)

#### Backend

```bash
cd changisha_backend

# Build Docker image
docker build -t changisha-bills-backend .

# Run with Docker Compose
docker-compose up -d
```

#### Frontend

```bash
cd changisha_frontend

# Build Docker image
docker build -t changisha-bills-frontend .

# Run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment

#### Backend Production

```bash
# Install production dependencies
pip install -r requirements.txt

# Set production environment
export ENVIRONMENT=production

# Run with Gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

#### Frontend Production

```bash
# Build for production
npm run build

# Serve with Nginx or any web server
# The build output is in the 'dist' directory
```

## 🔧 Development

### Code Style

- **Backend**: Follow PEP 8 guidelines
- **Frontend**: Use ESLint and Prettier configurations
- **TypeScript**: Strict mode enabled for better type safety

### Git Workflow

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit: `git commit -m "Add new feature"`
3. Push to branch: `git push origin feature/new-feature`
4. Create Pull Request

### Database Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "Add new table"

# Apply migrations
alembic upgrade head

# Downgrade to specific version
alembic downgrade -1
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Add** tests for new functionality
5. **Ensure** all tests pass
6. **Submit** a Pull Request

### Contribution Guidelines

- Write clean, documented code
- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. **Check** the [Issues](https://github.com/Matsukatm/changisha-bills/issues) page
2. **Create** a new issue with detailed information
3. **Join** our community discussions

## 🙏 Acknowledgments

- **FastAPI** for the amazing web framework
- **React** and **Chakra UI** for the frontend
- **M-Pesa** for payment integration
- **OpenAI** for assistance in development

---

**Built with ❤️ for the Kenyan fintech ecosystem**
