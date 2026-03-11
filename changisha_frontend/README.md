# Changisha Bills Frontend

A modern, production-ready React frontend for Changisha Bills - a fintech application for smart bill management and contribution tracking.

## Features

- 🏠 **Dashboard** - Overview of bills, contributions, and statistics
- 💰 **Bill Management** - Create, update, and track bills with progress
- 📊 **Contribution Tracking** - Add and monitor contributions to bills
- 🔔 **Reminders** - Never miss a payment deadline
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 🔐 **Secure Authentication** - JWT-based authentication system

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Chakra UI
- **State Management**: Zustand
- **Routing**: React Router
- **Data Fetching**: React Query + Axios
- **Form Validation**: React Hook Form + Zod
- **Testing**: Vitest + React Testing Library
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (via Chakra UI)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd changisha_frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Changisha Bills
VITE_APP_VERSION=1.0.0
```

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run preview       # Preview production build

# Building
npm run build        # Build for production
npm run build:analyze # Analyze bundle size

# Testing
npm run test         # Run tests
npm run test:ui     # Run tests with UI
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # Run TypeScript check

# Formatting
npm run format       # Format code with Prettier
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BillCard.tsx
│   ├── BillFormModal.tsx
│   ├── ContributionModal.tsx
│   └── Dashboard.tsx
├── pages/              # Page components
│   ├── Auth.tsx
│   └── Dashboard.tsx
├── services/           # API service layer
│   ├── api-client.ts
│   ├── auth.service.ts
│   ├── bill.service.ts
│   └── ...
├── store/              # State management
│   ├── auth.store.ts
│   ├── bill.store.ts
│   └── ...
├── types/              # TypeScript types
│   ├── api.ts
│   └── ui.ts
├── test/               # Test files
│   ├── setup.ts
│   ├── mocks/
│   └── *.test.tsx
├── utils/              # Utility functions
└── hooks/              # Custom React hooks
```

## API Integration

The frontend integrates with the Changisha Bills backend API:

- **Authentication**: `/api/v1/auth/*`
- **Bills**: `/api/v1/bills/*`
- **Contributions**: `/api/v1/contributions/*`
- **Payments**: `/api/v1/payments/*`
- **Notifications**: `/api/v1/notifications/*`

## Testing

The project includes comprehensive test coverage:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Environment-Specific Builds

```bash
# Development build
npm run build:dev

# Production build
npm run build:prod

# Staging build
npm run build:staging
```

## Performance

- **Bundle Analysis**: Use `npm run build:analyze` to analyze bundle size
- **Code Splitting**: Automatic code splitting by route
- **Tree Shaking**: Dead code elimination
- **Lazy Loading**: Components loaded on demand

## Security

- **JWT Authentication**: Secure token-based authentication
- **CORS**: Proper CORS configuration
- **Input Validation**: Client-side validation with Zod
- **XSS Protection**: Built-in React protections

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details.
