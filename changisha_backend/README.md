# Changisha Bills Backend

A production-ready backend for the Changisha Bills financial app built with FastAPI.

## Features

- **User Management**: Registration, login, JWT authentication
- **Bill Management**: Create, update, delete bills with target amounts and due dates
- **Contribution System**: Track contributions towards bills
- **Reminder System**: Automated reminders via Celery tasks
- **Payment Integration**: M-Pesa integration for automatic payments
- **Analytics**: Event tracking for future insights

## Technologies

- **FastAPI**: High-performance REST API
- **PostgreSQL**: Reliable database for financial data
- **SQLAlchemy**: ORM for database interactions
- **Alembic**: Database migrations
- **Redis**: Caching and session storage
- **Celery**: Background task processing
- **Pydantic**: Data validation
- **Docker**: Containerization

## Project Structure

```
changisha_backend/
├─ app/
│  ├─ main.py                 # FastAPI app entry point
│  ├─ core/                   # Configuration, security, logging
│  ├─ database/               # Database connection and session
│  ├─ models/                 # SQLAlchemy ORM models
│  ├─ schemas/                # Pydantic request/response models
│  ├─ api/v1/                 # API routers
│  ├─ services/               # Business logic services
│  ├─ workers/                # Celery tasks
│  ├─ integrations/           # External service integrations
│  └─ utils/                  # Helper functions
├─ alembic/                   # Database migrations
├─ tests/                     # Unit tests
├─ Dockerfile                 # Docker image
├─ docker-compose.yml         # Multi-service setup
├─ requirements.txt           # Python dependencies
└─ .env.example               # Environment variables template
```

## Setup and Installation

### Prerequisites

- Docker and Docker Compose
- Python 3.11+ (if running locally)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd changisha_backend
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Run the Application**
   ```bash
   docker-compose up --build
   ```

4. **Run Database Migrations**
   ```bash
   docker-compose exec backend alembic upgrade head
   ```

5. **Access the API**
   - API Documentation: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Local Development Setup

1. **Create Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env
   ```

4. **Run PostgreSQL and Redis**
   ```bash
   # Using Docker for services
   docker run -d -p 5432:5432 -e POSTGRES_DB=changisha_bills -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password postgres:15
   docker run -d -p 6379:6379 redis:7-alpine
   ```

5. **Run Migrations**
   ```bash
   alembic upgrade head
   ```

6. **Start the Server**
   ```bash
   uvicorn app.main:app --reload
   ```

7. **Run Celery Worker**
   ```bash
   celery -A app.workers.celery_app worker --loglevel=info
   ```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout

### Bills
- `GET /api/v1/bills` - List user's bills
- `POST /api/v1/bills` - Create a bill
- `GET /api/v1/bills/{id}` - Get bill details
- `PUT /api/v1/bills/{id}` - Update bill
- `DELETE /api/v1/bills/{id}` - Delete bill

### Contributions
- `GET /api/v1/contributions` - List contributions
- `POST /api/v1/contributions` - Add contribution

### Payments
- `GET /api/v1/payments` - List payments
- `POST /api/v1/payments` - Initiate payment

## Testing

```bash
pytest
```

## Deployment

1. Set production environment variables
2. Build and deploy using Docker
3. Run migrations on production database
4. Configure reverse proxy (nginx)
5. Set up monitoring and logging

## Security Considerations

- JWT tokens with expiration
- Password hashing with bcrypt
- Input validation with Pydantic
- CORS configuration
- Rate limiting (future)
- HTTPS required in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License.