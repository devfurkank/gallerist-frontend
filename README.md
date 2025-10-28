# 🚗 Gallerist Frontend

A modern, responsive web application for automotive dealership management built with React, TypeScript, and Vite. Features a beautiful UI with dark mode support, comprehensive CRUD operations, and real-time data management.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Routing](#routing)
- [UI Components](#ui-components)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)

## 🎯 Overview

Gallerist Frontend is a comprehensive single-page application (SPA) that provides an intuitive interface for managing all aspects of an automotive dealership business. Built with modern web technologies, it offers a seamless user experience with real-time data synchronization and a beautiful, responsive design.

## ✨ Features

### 🎨 User Interface
- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Dark Mode**: Full dark mode support with system preference detection
- **Responsive Layout**: Mobile-first design that works on all devices
- **Beautiful Components**: Radix UI primitives with custom styling
- **Smooth Animations**: Framer Motion for delightful transitions

### 🔐 Authentication
- JWT-based authentication
- Automatic token refresh mechanism
- Protected routes
- Secure session management
- Login and registration flows

### 📊 Core Modules

#### 🚘 Car Management
- List all vehicles with filtering and search
- Add new cars with detailed information
- Edit existing car records
- Track car status (Available, Sold, Reserved, Service, Accident)
- Multi-currency pricing support

#### 👥 Customer Management
- Customer database with full CRUD operations
- Customer details and contact information
- Address management integration
- Purchase history tracking

#### 🏢 Gallerist Management
- Dealer/gallerist information management
- Address association
- Active inventory tracking

#### 📦 Inventory Management
- Car-gallerist assignment tracking
- Real-time inventory status
- Bulk operations support

#### 💰 Sales Management
- Record new sales transactions
- View sales history
- Sales analytics and reporting
- Transaction details

#### 🏠 Address Management
- Centralized address database
- Address creation and editing
- Association with customers and gallerists

#### 💼 Account Management
- Financial account tracking
- Multi-currency support
- Balance monitoring

#### 💵 Currency Rates
- Real-time currency rate tracking
- Multi-currency conversion
- Exchange rate management (TL, USD)

### 🛠 Technical Features
- **Type Safety**: Full TypeScript implementation
- **Form Validation**: Zod schemas with React Hook Form
- **Data Fetching**: TanStack Query for efficient data management
- **State Management**: Zustand for global state
- **API Client**: Axios with interceptors and retry logic
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Toast Notifications**: Beautiful toast notifications with Sonner
- **Code Quality**: ESLint and TypeScript strict mode

## 🛠 Technology Stack

### Core Technologies
- **React 18.3.1** - UI library
- **TypeScript 5.5.3** - Type safety
- **Vite 5.4.2** - Build tool and dev server
- **React Router DOM 7.9.4** - Routing
- **TailwindCSS 3.4.1** - Utility-first CSS framework

### State & Data Management
- **Zustand 5.0.8** - Global state management
- **TanStack Query 5.90.5** - Server state management
- **React Hook Form 7.65.0** - Form handling
- **Zod 4.1.12** - Schema validation

### UI Components & Styling
- **Radix UI** - Headless UI primitives
  - Dialog, Dropdown, Select, Popover, Tabs, etc.
- **Lucide React 0.344.0** - Icon library
- **Framer Motion 12.23.24** - Animation library
- **Tailwind Merge** - Class name merging utility
- **Class Variance Authority** - Component variants

### Data Visualization
- **Recharts 3.3.0** - Charts and graphs
- **TanStack Table 8.21.3** - Advanced data tables

### HTTP & API
- **Axios 1.12.2** - HTTP client
- **Date-fns 4.1.0** - Date manipulation

### Notifications
- **Sonner 2.0.7** - Toast notifications

### Development Tools
- **ESLint 9.9.1** - Code linting
- **TypeScript ESLint** - TypeScript linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🏗 Architecture

### Application Architecture

```
Frontend (React SPA)
    ↓
API Client (Axios + Interceptors)
    ↓
Backend API (Spring Boot)
    ↓
PostgreSQL Database
```

### Design Patterns

- **Component-Based Architecture**: Reusable UI components
- **Container/Presenter Pattern**: Separation of logic and presentation
- **Custom Hooks**: Reusable business logic
- **HOC Pattern**: Protected routes and layout wrappers
- **Compound Components**: Complex UI patterns

### State Management Strategy

- **Server State**: TanStack Query (API data, caching, refetching)
- **Client State**: Zustand (auth state, theme, UI state)
- **Form State**: React Hook Form (local form state)
- **URL State**: React Router (navigation, params)

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm 9+** or **yarn** or **pnpm**
- **Backend API** running (default: `http://localhost:8080`)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd gallerist-backend/bolt-frontend
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080

# Optional configurations
VITE_APP_NAME=Gallerist
VITE_APP_VERSION=1.0.0
```

### 4. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173`

## ⚙️ Configuration

### Environment Variables

Create `.env.local` for local development:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_ENABLE_DEVTOOLS=true
```

For production (`.env.production`):

```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_ENABLE_DEVTOOLS=false
```

### API Client Configuration

The API client is configured in `src/lib/api/client.ts`:

```typescript
const apiClient: AxiosInstance = axios.create({
  baseURL: '', // Configure based on needs
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Vite Configuration

Customize build settings in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
});
```

## 📖 Usage

### Authentication

1. **Register**: Navigate to `/register` and create an account
2. **Login**: Go to `/login` and authenticate
3. **Dashboard**: Access protected routes after successful login

### Managing Cars

```
Dashboard → Cars → Add New Car
```

Fill in car details:
- License plate (Plaka)
- Brand and model
- Production year
- Price and currency
- Damage price (if applicable)
- Status (Available, Sold, etc.)

### Managing Customers

```
Dashboard → Customers → Add New Customer
```

Add customer information:
- Name and contact details
- Address information
- Additional notes

### Recording Sales

```
Dashboard → Sales → New Sale
```

Complete sale transaction:
- Select customer
- Select car
- Assign gallerist
- Confirm sale details

### Currency Rates

```
Dashboard → Currency Rates
```

View and update exchange rates for TRY, USD, and EUR.

## 📁 Project Structure

```
bolt-frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── auth/          # Authentication components
│   │   │   └── ProtectedRoute.tsx
│   │   ├── layout/        # Layout components
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── theme/         # Theme components
│   │   │   ├── theme-provider.tsx
│   │   │   └── theme-toggle.tsx
│   │   └── ui/            # Reusable UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── ...
│   ├── lib/               # Utilities and configs
│   │   ├── api/           # API client and endpoints
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   ├── cars.ts
│   │   │   ├── customers.ts
│   │   │   ├── gallerists.ts
│   │   │   ├── addresses.ts
│   │   │   ├── accounts.ts
│   │   │   ├── inventory.ts
│   │   │   ├── sales.ts
│   │   │   └── currency-rates.ts
│   │   ├── schemas/       # Zod validation schemas
│   │   │   ├── auth.schema.ts
│   │   │   ├── car.schema.ts
│   │   │   ├── customer.schema.ts
│   │   │   ├── gallerist.schema.ts
│   │   │   └── ...
│   │   ├── store/         # Zustand stores
│   │   │   ├── auth-store.ts
│   │   │   └── theme-store.ts
│   │   ├── types/         # TypeScript type definitions
│   │   │   ├── api.types.ts
│   │   │   ├── car.types.ts
│   │   │   ├── customer.types.ts
│   │   │   ├── common.types.ts
│   │   │   └── index.ts
│   │   └── utils/         # Helper functions
│   │       ├── cn.ts
│   │       ├── constants.ts
│   │       ├── format.ts
│   │       └── validation.ts
│   ├── pages/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── dashboard/     # Dashboard home
│   │   │   └── DashboardHome.tsx
│   │   ├── cars/          # Car management
│   │   │   ├── CarsListPage.tsx
│   │   │   └── CarFormPage.tsx
│   │   ├── customers/     # Customer management
│   │   ├── gallerists/    # Gallerist management
│   │   ├── inventory/     # Inventory management
│   │   ├── sales/         # Sales management
│   │   ├── addresses/     # Address management
│   │   ├── accounts/      # Account management
│   │   ├── currency-rates/# Currency rates
│   │   └── PlaceholderPage.tsx
│   ├── App.tsx            # Root component
│   ├── main.tsx           # Entry point
│   ├── index.css          # Global styles
│   └── vite-env.d.ts      # Vite type definitions
├── .gitignore
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML template
├── package.json           # Dependencies
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
├── tsconfig.app.json      # App TypeScript config
├── tsconfig.node.json     # Node TypeScript config
└── vite.config.ts         # Vite configuration
```

## 📜 Available Scripts

### Development

```bash
# Start development server
npm run dev

# Type checking
npm run typecheck

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Production

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Other Commands

```bash
# Install dependencies
npm install

# Update dependencies
npm update

# Clean node_modules and reinstall
rm -rf node_modules package-lock.json && npm install
```

## 🔌 API Integration

### API Client Setup

The application uses Axios with interceptors for:

- **Request Interceptor**: Automatically adds JWT token to headers
- **Response Interceptor**: Handles token refresh and error responses
- **Error Handling**: Automatic retry and error normalization

### Example API Call

```typescript
// src/lib/api/cars.ts
import apiClient from './client';
import { Car, CreateCarRequest } from '../types/car.types';

export const getCars = async (): Promise<Car[]> => {
  const response = await apiClient.get('/cars');
  return response.data.payload;
};

export const createCar = async (data: CreateCarRequest): Promise<Car> => {
  const response = await apiClient.post('/cars', data);
  return response.data.payload;
};
```

### Using in Components

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { getCars, createCar } from '@/lib/api/cars';

function CarsPage() {
  // Fetch data
  const { data: cars, isLoading } = useQuery({
    queryKey: ['cars'],
    queryFn: getCars,
  });

  // Mutate data
  const createMutation = useMutation({
    mutationFn: createCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
  });

  // ...
}
```

## 🗃 State Management

### Auth Store (Zustand)

```typescript
// src/lib/store/auth-store.ts
import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (user) => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));
```

### Usage in Components

```typescript
import { useAuthStore } from '@/lib/store/auth-store';

function Header() {
  const { user, logout } = useAuthStore();
  
  return (
    <div>
      <span>Welcome, {user?.username}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 🛣 Routing

### Route Structure

```typescript
// Public routes
/login              - Login page
/register           - Registration page

// Protected routes (requires authentication)
/dashboard          - Dashboard home
/dashboard/cars     - Car list
/dashboard/cars/new - New car form
/dashboard/cars/:id/edit - Edit car
// ... similar patterns for other modules
```

### Protected Route Implementation

```typescript
// src/components/auth/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store/auth-store';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}
```

## 🎨 UI Components

### Component Library

All UI components are built with Radix UI and styled with Tailwind CSS:

- **Button**: Various variants (default, destructive, outline, ghost)
- **Card**: Container component with header, content, footer
- **Dialog**: Modal dialogs for confirmations and forms
- **Input**: Form input with validation states
- **Label**: Accessible form labels
- **Badge**: Status indicators
- **Delete Dialog**: Reusable confirmation dialog

### Using Components

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default">Click me</Button>
      </CardContent>
    </Card>
  );
}
```

### Theme System

```typescript
// Toggle between light and dark mode
import { useTheme } from '@/components/theme/theme-provider';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  );
}
```

## 🔧 Development

### Code Style Guidelines

- Use functional components with hooks
- Prefer TypeScript interfaces for props
- Use meaningful variable names
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use Zod for runtime validation

### Custom Hooks

Create custom hooks for reusable logic:

```typescript
// src/hooks/useCars.ts
import { useQuery } from '@tanstack/react-query';
import { getCars } from '@/lib/api/cars';

export function useCars() {
  return useQuery({
    queryKey: ['cars'],
    queryFn: getCars,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### Form Handling

Using React Hook Form with Zod validation:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { carSchema } from '@/lib/schemas/car.schema';

function CarForm() {
  const form = useForm({
    resolver: zodResolver(carSchema),
    defaultValues: {
      brand: '',
      model: '',
      // ...
    },
  });

  const onSubmit = (data) => {
    // Handle form submission
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
}
```

### Error Handling

```typescript
import { toast } from 'sonner';

try {
  await createCar(data);
  toast.success('Car created successfully');
} catch (error) {
  toast.error('Failed to create car');
  console.error(error);
}
```

## 🏗 Building for Production

### Build Process

```bash
# Create optimized production build
npm run build

# Output will be in dist/ directory
```

### Build Configuration

Optimize your build in `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
});
```

### Performance Optimization

- Code splitting by route
- Lazy loading for heavy components
- Image optimization
- Tree shaking
- Minification
- Gzip compression

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Production deployment
netlify deploy --prod
```

### Deploy with Docker

```dockerfile
# Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and run
docker build -t gallerist-frontend .
docker run -p 80:80 gallerist-frontend
```

### Environment Variables for Deployment

Set these in your deployment platform:

```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

## 🔍 Troubleshooting

### Common Issues

#### API Connection Failed
```bash
# Check if backend is running
curl http://localhost:8080/health

# Check CORS configuration in backend
# Ensure backend allows frontend origin
```

#### Authentication Issues
```bash
# Clear browser storage
localStorage.clear();

# Check JWT token expiration
# Verify refresh token mechanism
```

#### Build Errors
```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 👨‍💻 Author

**Furkan Keskin**
- GitHub: [@devfurkank](https://github.com/devfurkank)

## 🗺 Roadmap

### Upcoming Features
- [ ] Advanced search and filtering
- [ ] Export to Excel/PDF
- [ ] Email notifications
- [ ] Multi-language support (i18n)
- [ ] Advanced analytics dashboard
- [ ] Bulk operations
- [ ] File upload support
- [ ] Print functionality
- [ ] Mobile app (React Native)

---

## 🔗 Backend Integration

This frontend application is designed to work with the Gallerist Backend API. 

### API Endpoints Used

All API requests go through `/rest/api/` prefix:

- **Cars**: `/rest/api/car/*`
- **Gallerists**: `/rest/api/gallerist/*`
- **Customers**: `/rest/api/customer/*`
- **Inventory**: `/rest/api/gallerist-car/*`
- **Sales**: `/rest/api/saled-car/*`
- **Addresses**: `/rest/api/address/*`
- **Accounts**: `/rest/api/account/*`
- **Currency Rates**: `/rest/api/currency-rates`
- **Authentication**: `/register`, `/authenticate`, `/refresh_token`

### Backend Compatibility

**Backend Requirements:**
- Spring Boot 3.5.6
- Java 21
- PostgreSQL 14+
- RESTful API with JWT authentication

**Response Format:**
All backend responses follow this structure:
```typescript
{
  payload: T  // Actual data
}
```

**Field Mapping:**
The frontend automatically maps between backend and frontend field names:
- Backend: `plaka` → Frontend: `plate`
- Backend: `createTime` → Frontend: `createdAt`
- Backend: `firstName` → Frontend: `firstName` (same)

### Environment Setup

Make sure your `.env` file points to the correct backend URL:

```env
VITE_API_BASE_URL=http://localhost:8080
```

For production:
```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

---