# Gallerist - Car Dealership Management System

A modern, feature-rich frontend application for managing car dealerships. Built with React, TypeScript, and Tailwind CSS.

## Features

### Core Functionality
- **Authentication System** - Secure login and registration with JWT tokens
- **Dashboard** - Overview with statistics, charts, and quick actions
- **Car Management** - Complete CRUD operations for car inventory
- **Gallerist Management** - Manage gallerists and their assignments
- **Customer Management** - Track customers with TCKN validation
- **Sales Management** - Record and track car sales
- **Inventory Management** - Assign cars to gallerists
- **Accounts & Addresses** - Financial and location management
- **Analytics** - Sales reports and data visualization

### Design & UX
- Beautiful, modern UI with Shadcn components
- Dark mode support with system preference detection
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations with Framer Motion
- Toast notifications for user feedback
- Loading states and skeleton screens
- Form validation with Zod

## Technology Stack

### Core
- **React 18** - Modern React with hooks
- **TypeScript 5** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing

### State Management & Data
- **TanStack Query (React Query)** - Server state management
- **Zustand** - Client state (auth, theme)
- **Axios** - HTTP client with interceptors

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI primitives
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **Class Variance Authority** - Component variants

### Forms & Validation
- **React Hook Form** - Performant forms
- **Zod** - Schema validation
- TCKN, IBAN, and Turkish license plate validation

### Charts & Analytics
- **Recharts** - Data visualization

## Project Structure

```
gallerist-frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components (Button, Input, Card, etc.)
│   │   ├── layout/          # Layout components (Header, Sidebar)
│   │   ├── auth/            # Authentication components
│   │   └── theme/           # Theme provider and toggle
│   ├── lib/
│   │   ├── api/             # API client and service modules
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # Zustand stores
│   │   ├── schemas/         # Zod validation schemas
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── pages/
│   │   ├── auth/            # Login and Register pages
│   │   ├── dashboard/       # Dashboard home
│   │   └── cars/            # Car management pages
│   ├── App.tsx              # Main app component with routing
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── vite.config.ts           # Vite configuration
```

## Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn
- Backend API running (default: http://localhost:8080)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd gallerist-frontend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables (Optional)

**Note:** The application uses a Vite proxy configuration for development, so CORS issues are automatically handled. You don't need to configure environment variables for local development.

If you want to customize the backend URL, create a `.env` file:
```bash
# .env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=Gallerist Management System
```

For development without `.env` file, the app will use the proxy configuration automatically (`/api` → `http://localhost:8080`).

4. **Start backend server first**
```bash
# In the gallerist directory (backend)
./mvnw spring-boot:run
```

Backend will start at `http://localhost:8080`

5. Start frontend development server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## API Integration

### Backend Endpoints

The application integrates with a REST API with the following endpoints:

#### Authentication
- `POST /authenticate` - User login
- `POST /register` - User registration
- `POST /refresh_token` - Refresh access token

#### Cars
- `GET /api/v1/car` - Get all cars
- `GET /api/v1/car/{id}` - Get car by ID
- `POST /api/v1/car` - Create car
- `PUT /api/v1/car/{id}` - Update car
- `DELETE /api/v1/car/{id}` - Delete car

#### Gallerists
- `GET /api/v1/gallerist` - Get all gallerists
- `GET /api/v1/gallerist/{id}` - Get gallerist by ID
- `POST /api/v1/gallerist` - Create gallerist
- `PUT /api/v1/gallerist/{id}` - Update gallerist
- `DELETE /api/v1/gallerist/{id}` - Delete gallerist

#### Customers
- `GET /api/v1/customer` - Get all customers
- `GET /api/v1/customer/{id}` - Get customer by ID
- `POST /api/v1/customer` - Create customer
- `PUT /api/v1/customer/{id}` - Update customer
- `DELETE /api/v1/customer/{id}` - Delete customer

#### Sales
- `GET /api/v1/saled-car` - Get all sales
- `GET /api/v1/saled-car/{id}` - Get sale by ID
- `POST /api/v1/saled-car` - Register sale
- `PUT /api/v1/saled-car/{id}` - Update sale
- `DELETE /api/v1/saled-car/{id}` - Delete sale

#### Other Modules
- Accounts: `/api/v1/account`
- Addresses: `/api/v1/address`
- Inventory: `/api/v1/gallerist-car`

All responses follow the `RootEntity<T>` format:
```typescript
{
  data: T,
  status?: string,
  message?: string
}
```

### Authentication Flow

1. User logs in via `/authenticate`
2. Access token stored in memory, refresh token in state
3. Access token attached to all API requests via Axios interceptor
4. On 401 error, token is automatically refreshed
5. User redirected to login if refresh fails

## Features in Detail

### Dashboard Home
- Statistics cards with count-up animations
- Revenue and sales charts
- Recent sales list
- Available cars overview
- Trend indicators

### Car Management
- Grid and list views
- Advanced search and filtering
- Status badges (Salable/Sold)
- Complete form validation
- Turkish license plate format support
- Multi-currency support (TRY, USD, EUR)

### Dark Mode
- System preference detection
- Smooth theme transitions
- Persistent theme selection
- All components styled for both modes

### Form Validation
- Real-time validation with Zod
- Turkish-specific validations:
  - TCKN (11-digit with algorithm)
  - IBAN (Turkish format)
  - License plates (34 ABC 1234)
  - Postal codes (5 digits)
- Helpful error messages
- Required field indicators

### Responsive Design
Breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

Features adapt:
- Collapsible sidebar → mobile menu
- Grid layouts → single column
- Table views → card views

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow React best practices
- Component composition over prop drilling
- Custom hooks for reusable logic
- Proper error boundaries

### Component Structure
```tsx
// Example component structure
import { useState } from 'react';
import { Component } from './types';

interface Props {
  data: Component;
  onAction: (id: string) => void;
}

export function MyComponent({ data, onAction }: Props) {
  const [state, setState] = useState();

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### State Management
- Use TanStack Query for server state
- Use Zustand for client state
- Keep state close to where it's used
- Avoid prop drilling

### Performance
- Code splitting with lazy loading
- Memoize expensive computations
- Optimize re-renders with React.memo
- Use proper React Query cache settings

## Troubleshooting

### Build Issues
If build fails:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Type Errors
Run type checking:
```bash
npm run typecheck
```

### Backend Connection

**Development Mode:**
The frontend uses Vite's proxy feature to avoid CORS issues during development:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- Proxy: All requests to `/api/*` are forwarded to `http://localhost:8080`

**Troubleshooting:**
1. Ensure backend is running on port 8080
2. Check backend console for errors
3. Verify PostgreSQL database is running
4. Check browser console for API errors
5. Network tab in DevTools shows actual requests

**Production Mode:**
For production builds, set `VITE_API_URL` environment variable to your backend URL before building:
```bash
VITE_API_URL=https://your-api-domain.com npm run build
```

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing
1. Create a feature branch
2. Make your changes
3. Run linting and type checking
4. Test thoroughly
5. Submit pull request

## License
MIT

## Support
For issues and questions, please open a GitHub issue.

---

Built with React, TypeScript, and Tailwind CSS
