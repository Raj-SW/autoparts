# 🚗 A.M.O Auto Parts - Comprehensive Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Core Concepts](#core-concepts)
6. [Data Flow](#data-flow)
7. [Component System](#component-system)
8. [API Structure](#api-structure)
9. [State Management](#state-management)
10. [Utilities & Helpers](#utilities--helpers)
11. [Styling & Theming](#styling--theming)
12. [Authentication Flow](#authentication-flow)
13. [Order Management](#order-management)
14. [Working with the Codebase](#working-with-the-codebase)
15. [Common Patterns](#common-patterns)
16. [Troubleshooting](#troubleshooting)

---

## Project Overview

### What is A.M.O Auto Parts?
A.M.O Distribution Ltd is a Next.js-based e-commerce platform for automotive spare parts in Mauritius. It specializes in:
- Premium car parts (BMW, Audi, Mercedes)
- 4x4 vehicle parts (Toyota Hilux, Ford Ranger)
- Car body parts (headlamps, bumpers, mirrors, etc.)
- Fast delivery (1-hour quotes, same-day delivery)

### Key Features
- 🔍 **Smart Search** - Debounced search with filters
- 🛒 **Shopping Cart** - Local storage-based cart
- 💳 **Payment Integration** - Stripe payments
- 👤 **User Authentication** - JWT-based auth
- 📱 **Mobile Responsive** - Works on all devices
- 🎯 **Admin Dashboard** - Manage parts, orders, users
- 📧 **Email Notifications** - Order confirmations
- 📄 **Quote System** - Request custom quotes
- 🤝 **Partner Program** - B2B partnerships

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Pages   │  │Components│  │ Contexts │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│         │             │              │                   │
│         └─────────────┴──────────────┘                   │
│                       │                                  │
│              ┌────────▼────────┐                         │
│              │   API Client    │                         │
│              └────────┬────────┘                         │
└───────────────────────┼──────────────────────────────────┘
                        │
                ┌───────▼───────┐
                │  API Routes   │  (Next.js API)
                └───────┬───────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
   ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
   │ MongoDB │    │ Stripe  │    │Cloudinary│
   └─────────┘    └─────────┘    └─────────┘
```

### Layer Breakdown

1. **Presentation Layer** (app/, components/)
   - React components
   - Pages and routing
   - UI components

2. **State Management** (contexts/)
   - AuthContext - User authentication
   - CartContext - Shopping cart

3. **Business Logic** (lib/)
   - API client
   - Utilities
   - Constants

4. **API Layer** (app/api/)
   - RESTful endpoints
   - Authentication middleware
   - Database operations

5. **Data Layer** (models/)
   - MongoDB schemas
   - Data validation

---

## Technology Stack

### Frontend
- **Next.js 15.2.4** - React framework
- **React 18.2** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **Shadcn/ui** - Component library

### Backend
- **Next.js API Routes** - Server-side logic
- **MongoDB 6.17** - Database
- **Mongoose 8.16** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Third-Party Services
- **Stripe** - Payment processing
- **Cloudinary** - Image hosting
- **Nodemailer** - Email service
- **Puppeteer** - PDF generation

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **pnpm/npm** - Package management

---

## Project Structure

```
autoparts/
├── app/                          # Next.js 13+ App Directory
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── parts/                # Parts CRUD
│   │   ├── orders/               # Order management
│   │   ├── quotes/               # Quote system
│   │   └── admin/                # Admin endpoints
│   ├── components/               # Page-specific components
│   │   ├── home/                 # Homepage sections
│   │   ├── Navigation.tsx        # Main navigation
│   │   ├── Footer.tsx            # Site footer
│   │   └── ...
│   ├── catalog/                  # Parts catalog
│   ├── checkout/                 # Checkout flow
│   ├── dashboard/                # User dashboard
│   ├── admin/                    # Admin panel
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
│
├── components/                   # Reusable components
│   ├── shared/                   # Shared UI components
│   ├── forms/                    # Form components
│   ├── ui/                       # Shadcn/ui components
│   └── ...
│
├── contexts/                     # React Context providers
│   ├── AuthContext.tsx           # Authentication state
│   └── CartContext.tsx           # Shopping cart state
│
├── hooks/                        # Custom React hooks
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── ...
│
├── lib/                          # Utility libraries
│   ├── constants/                # App constants
│   ├── utils/                    # Helper functions
│   ├── auth/                     # Auth utilities
│   ├── db/                       # Database connection
│   ├── email/                    # Email services
│   ├── pdf/                      # PDF generation
│   ├── api-client.ts             # API client
│   └── stripe.ts                 # Stripe config
│
├── middleware/                   # Middleware functions
│   └── auth.ts                   # Auth middleware
│
├── models/                       # Database models
│   ├── User.ts                   # User schema
│   ├── Part.ts                   # Part schema
│   ├── Order.ts                  # Order schema
│   ├── Quote.ts                  # Quote schema
│   └── Partner.ts                # Partner schema
│
├── types/                        # TypeScript types
│   └── index.ts                  # Type definitions
│
├── public/                       # Static assets
│   └── ...
│
├── scripts/                      # Utility scripts
│   ├── seed-body-parts.js        # Seed body parts
│   └── seed-mongodb.js           # Seed database
│
└── [config files]                # Configuration
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    └── next.config.mjs
```

---

## Core Concepts

### 1. App Router (Next.js 13+)
Next.js uses a file-system based router where folders define routes.

**Example:**
```
app/
├── page.tsx              → /
├── about/
│   └── page.tsx          → /about
├── catalog/
│   ├── page.tsx          → /catalog
│   └── [id]/
│       └── page.tsx      → /catalog/123
```

### 2. Server vs Client Components
- **Server Components** (default) - Rendered on server
- **Client Components** (`"use client"`) - Interactive, use hooks

**When to use Client Components:**
- Need useState, useEffect, or other hooks
- Need browser APIs
- Need event handlers
- Need Context

### 3. API Routes
Located in `app/api/`, they handle backend logic.

**Example Route:**
```typescript
// app/api/parts/route.ts
export async function GET(request: NextRequest) {
  // Handle GET request
}

export async function POST(request: NextRequest) {
  // Handle POST request
}
```

### 4. TypeScript Types
All types are defined in `types/index.ts` for consistency.

```typescript
import type { Part, User, Order } from '@/types';
```

### 5. Contexts (Global State)
Two main contexts:
- **AuthContext** - User authentication state
- **CartContext** - Shopping cart state

---

## Data Flow

### 1. Fetching Data (User Views Parts)

```
┌──────────┐
│  User    │
│  Opens   │
│ Catalog  │
└────┬─────┘
     │
     ▼
┌──────────────────────┐
│  Catalog Page        │
│  (Client Component)  │
└──────┬───────────────┘
       │
       │ useEffect()
       ▼
┌──────────────────────┐
│  API Client          │
│  apiClient.getParts()│
└──────┬───────────────┘
       │
       │ fetch()
       ▼
┌──────────────────────┐
│  API Route           │
│  /api/parts          │
└──────┬───────────────┘
       │
       │ Query
       ▼
┌──────────────────────┐
│  MongoDB             │
│  parts collection    │
└──────┬───────────────┘
       │
       │ Return data
       ▼
┌──────────────────────┐
│  Parts displayed     │
│  on page             │
└──────────────────────┘
```

### 2. Adding to Cart

```
User clicks "Add to Cart"
       ↓
Button onClick handler
       ↓
CartContext.addItem()
       ↓
Update state + localStorage
       ↓
Cart badge updates
       ↓
Toast notification
```

### 3. Authentication Flow

```
User enters credentials
       ↓
Form submission
       ↓
apiClient.login()
       ↓
POST /api/auth/login
       ↓
Verify credentials
       ↓
Generate JWT tokens
       ↓
Return tokens + user data
       ↓
Store in localStorage
       ↓
AuthContext updates
       ↓
User redirected
```

---

## Component System

### Component Hierarchy

```
App Layout (layout.tsx)
└── Providers (Auth, Cart)
    └── Navigation
    └── Page Content
        ├── Shared Components (LoadingSpinner, etc.)
        ├── Form Components (FormInput, etc.)
        └── Page-specific Components
    └── Footer
```

### Component Categories

#### 1. Shared Components (`components/shared/`)
**Purpose:** Reusable UI components used across the app

**Examples:**
```typescript
// Loading state
<LoadingSpinner size="lg" text="Loading..." />

// Price display
<PriceDisplay price={2500} currency="MUR" originalPrice={3000} />

// Stock indicator
<StockBadge stock={5} />

// Empty state
<EmptyState 
  title="No parts found"
  description="Try adjusting filters"
  action={{ label: "Clear", onClick: reset }}
/>
```

#### 2. Form Components (`components/forms/`)
**Purpose:** Standardized form inputs with validation

**Examples:**
```typescript
<FormInput
  label="Part Name"
  name="name"
  value={name}
  onChange={handleChange}
  error={errors.name}
  required
/>

<FormSelect
  label="Category"
  options={categories}
  value={category}
  onValueChange={setCategory}
  error={errors.category}
/>
```

#### 3. UI Components (`components/ui/`)
**Purpose:** Base components from Shadcn/ui

**Examples:**
```typescript
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
```

#### 4. Page Components (`app/components/`)
**Purpose:** Components specific to certain pages

**Examples:**
- `Navigation.tsx` - Main navigation bar
- `Footer.tsx` - Site footer
- `home/HeroSection.tsx` - Homepage hero

---

## API Structure

### Endpoints Overview

```
/api/auth/
  ├── login              POST   - User login
  ├── register           POST   - User registration
  ├── profile            GET    - Get user profile
  ├── profile            PUT    - Update profile
  └── refresh            POST   - Refresh token

/api/parts/
  ├── /                  GET    - List parts (with filters)
  ├── /                  POST   - Create part (admin)
  ├── /:id               GET    - Get part details
  ├── /:id               PUT    - Update part (admin)
  └── /:id               DELETE - Delete part (admin)

/api/orders/
  ├── /                  GET    - List orders
  ├── /                  POST   - Create order
  ├── /:id               GET    - Get order details
  ├── /:id               PATCH  - Update order
  └── /track/:number     GET    - Track order

/api/quotes/
  ├── /                  GET    - List quotes
  ├── /                  POST   - Create quote
  ├── /:id               GET    - Get quote
  ├── /:id               PATCH  - Update quote
  └── /:id/pdf           GET    - Download PDF

/api/admin/
  ├── /dashboard         GET    - Admin stats
  └── /users             GET    - List users
      └── /:id           GET    - Get user
                         PATCH  - Update user
                         DELETE - Delete user

/api/payment/
  ├── /create-intent     POST   - Create payment
  └── /webhook           POST   - Stripe webhook
```

### API Client Usage

The API client (`lib/api-client-optimized.ts`) provides methods for all endpoints:

```typescript
import { apiClient } from '@/lib/api-client-optimized';

// Authentication
await apiClient.login(email, password);
await apiClient.register({ email, password, name });
await apiClient.getProfile();

// Parts
await apiClient.getParts({ category: 'Engine', page: 1 });
await apiClient.getPart(partId);
await apiClient.createPart(partData);

// Orders
await apiClient.getOrders();
await apiClient.createOrder(orderData);

// Cache control
apiClient.clearCache(); // Clear all cache
apiClient.clearCache('GET-/api/parts'); // Clear specific
```

### API Features

#### 1. Caching
Responses are cached for 5 minutes to reduce API calls.

```typescript
// First call hits API
const data1 = await apiClient.getParts();

// Second call returns cached data (within 5 min)
const data2 = await apiClient.getParts();

// Force skip cache
const fresh = await apiClient.getParts({ skipCache: true });
```

#### 2. Request Deduplication
Prevents duplicate simultaneous requests.

```typescript
// Both calls will share the same request
Promise.all([
  apiClient.getParts(),
  apiClient.getParts()
]);
// Only one API call is made
```

#### 3. Auto Token Refresh
Automatically refreshes expired access tokens.

```typescript
// If access token expires, it's automatically refreshed
await apiClient.getParts(); // May trigger refresh
```

---

## State Management

### 1. AuthContext

**Location:** `contexts/AuthContext.tsx`

**Purpose:** Manages user authentication state globally

**Features:**
- User login/logout
- Profile management
- Password changes
- Role-based access

**Usage:**
```typescript
import { useAuth } from '@/contexts/AuthContext';

function Component() {
  const { user, loading, login, logout } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <Login />;
  
  return <div>Welcome {user.name}</div>;
}
```

**Higher-Order Component for Protected Routes:**
```typescript
import { withAuth } from '@/contexts/AuthContext';

const ProtectedPage = withAuth(
  function Page() {
    return <div>Protected Content</div>;
  },
  'admin' // Optional: require admin role
);
```

### 2. CartContext

**Location:** `contexts/CartContext.tsx`

**Purpose:** Manages shopping cart state

**Features:**
- Add/remove items
- Update quantities
- Persist to localStorage
- Calculate totals

**Usage:**
```typescript
import { useCart } from '@/contexts/CartContext';

function Component() {
  const { items, totalItems, totalPrice, addItem, removeItem } = useCart();
  
  const handleAdd = () => {
    addItem({
      id: part._id,
      name: part.name,
      price: part.price,
      stock: part.stock,
    });
  };
  
  return (
    <div>
      <p>Cart: {totalItems} items (Rs {totalPrice})</p>
      <Button onClick={handleAdd}>Add to Cart</Button>
    </div>
  );
}
```

### 3. Local Component State

For component-specific state, use useState:

```typescript
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Use state as needed
}
```

---

## Utilities & Helpers

### 1. Formatters (`lib/utils/formatters.ts`)

**Purpose:** Consistent formatting across the app

```typescript
import {
  formatPrice,
  formatDate,
  formatPhoneNumber,
  formatStockStatus,
  formatCompatibility
} from '@/lib/utils/formatters';

// Examples
formatPrice(2500, 'MUR')                    // "Rs 2,500"
formatDate(new Date(), 'short')             // "Jan 15, 2024"
formatPhoneNumber('57123456')               // "+230 5712 3456"
formatStockStatus(5, 10)                    // { label, variant, color }
formatCompatibility({
  make: ['Toyota'],
  model: ['Vitz'],
  year: [2008, 2009, 2010]
})                                          // "Toyota Vitz 2008-2010"
```

### 2. Validators (`lib/utils/validators.ts`)

**Purpose:** Input validation

```typescript
import {
  isValidEmail,
  isValidPhoneNumber,
  validatePassword,
  isValidPrice
} from '@/lib/utils/validators';

// Examples
isValidEmail('test@example.com')            // true
isValidPhoneNumber('57123456')              // true
validatePassword('weak')                    // { isValid: false, errors: [...] }
isValidPrice(100)                           // true
```

### 3. Constants (`lib/constants/index.ts`)

**Purpose:** Centralized configuration

```typescript
import {
  CAR_MAKES,
  PART_CATEGORIES,
  CONTACT_INFO,
  CURRENCY,
  VALIDATION,
  API_ENDPOINTS
} from '@/lib/constants';

// Examples
CAR_MAKES                    // ['BMW', 'Audi', 'Toyota', ...]
PART_CATEGORIES              // ['Engine', 'Brake', 'Body Parts', ...]
CONTACT_INFO.PHONE           // '+23057123456'
CURRENCY.SYMBOL              // 'Rs'
VALIDATION.MIN_PASSWORD_LENGTH  // 8
API_ENDPOINTS.AUTH.LOGIN     // '/api/auth/login'
```

### 4. Custom Hooks (`hooks/`)

**Purpose:** Reusable logic

```typescript
import { useDebounce } from '@/hooks/useDebounce';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useIsMobile } from '@/hooks/useMediaQuery';

// Debounce value (e.g., search input)
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 500);

// Persist to localStorage
const [theme, setTheme] = useLocalStorage('theme', 'light');

// Responsive design
const isMobile = useIsMobile();
```

---

## Styling & Theming

### Tailwind CSS

The app uses Tailwind CSS for styling with a mobile-first approach.

**Responsive Breakpoints:**
```typescript
// Default (mobile)     0px - 640px
sm:                     640px+
md:                     768px+
lg:                     1024px+
xl:                     1280px+
2xl:                    1536px+
```

**Example:**
```tsx
<div className="
  p-4              // Padding on mobile
  md:p-6           // Medium screens
  lg:p-8           // Large screens
  
  text-sm          // Small text on mobile
  md:text-base     // Normal on medium+
  
  grid
  grid-cols-1      // 1 column on mobile
  md:grid-cols-2   // 2 columns on tablet
  lg:grid-cols-4   // 4 columns on desktop
">
```

### Color Palette

**Primary Colors:**
- Primary: `#D72638` (Red) - Brand color
- Secondary: Various grays
- Accent: Green for success, Yellow for warnings

**Usage:**
```tsx
<div className="bg-[#D72638] text-white">
  {/* Primary color background */}
</div>

<Button className="bg-primary hover:bg-primary/90">
  {/* Uses theme primary */}
</Button>
```

### Component Variants

Shadcn/ui components have built-in variants:

```tsx
<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
```

---

## Authentication Flow

### Registration

```typescript
// 1. User fills registration form
const formData = {
  name: "John Doe",
  email: "john@example.com",
  password: "SecurePass123!",
  phoneNumber: "57123456"
};

// 2. Call register method
await apiClient.register(formData);

// 3. Backend creates user
// - Hashes password with bcrypt
// - Saves to MongoDB
// - Generates JWT tokens
// - Sends verification email

// 4. Returns tokens and user data
{
  user: { id, name, email, role },
  tokens: { accessToken, refreshToken }
}

// 5. Stored in localStorage
// 6. User logged in automatically
```

### Login

```typescript
// 1. User enters credentials
await apiClient.login(email, password);

// 2. Backend verifies
// - Finds user by email
// - Compares password hash
// - Generates JWT tokens

// 3. Returns user + tokens
// 4. Stored in localStorage
// 5. AuthContext updates
// 6. User redirected to dashboard
```

### Protected Routes

```typescript
// Method 1: Using withAuth HOC
export default withAuth(
  function AdminPage() {
    return <AdminContent />;
  },
  'admin' // Require admin role
);

// Method 2: Using useAuth hook
function ProtectedComponent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading]);
  
  if (loading) return <LoadingSpinner />;
  if (!user) return null;
  
  return <Content />;
}
```

### Token Refresh

```typescript
// Access token expires after 15 minutes
// Refresh token lasts 7 days

// Automatic refresh on API calls
apiClient.request('/api/parts') // If token expired, auto-refreshes

// Manual refresh
await apiClient.refreshAccessToken();
```

---

## Order Management

### Order Creation Flow

```
1. User adds items to cart
   └── CartContext.addItem()

2. User proceeds to checkout
   └── Navigate to /checkout

3. User enters shipping info
   └── Form validation

4. User pays via Stripe
   └── Payment intent created
   └── Stripe payment form
   └── Payment confirmed

5. Order created
   └── POST /api/orders
   └── Saves to MongoDB
   └── Sends confirmation email
   └── Clears cart

6. User sees order confirmation
   └── Navigate to /checkout/success
   └── Display order number
```

### Order Structure

```typescript
interface Order {
  _id: string;
  orderNumber: string;              // e.g., "ORD-2024-001"
  userId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  shippingAddress: Address;
  trackingNumber?: string;
  statusHistory: StatusUpdate[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Order Status Updates

```typescript
// Admin updates order status
await apiClient.updateOrder(orderId, {
  status: 'shipped',
  trackingNumber: 'TRK123456'
});

// Triggers:
// 1. Database update
// 2. Status history entry
// 3. Email notification to customer
// 4. Cache invalidation
```

---

## Working with the Codebase

### Setting Up Development Environment

```bash
# 1. Clone repository
git clone <repo-url>
cd autoparts

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your values

# 4. Start MongoDB (if local)
mongod

# 5. Seed database (optional)
npm run seed:body-parts

# 6. Start development server
npm run dev

# 7. Open browser
# http://localhost:3000
```

### Creating a New Page

```typescript
// 1. Create file: app/my-page/page.tsx
'use client'; // If using hooks/interactivity

import { PageHeader } from '@/components/shared/PageHeader';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';

export default function MyPage() {
  return (
    <div>
      <Navigation />
      <PageHeader title="My Page" description="Description" />
      
      <main className="container mx-auto px-4 py-8">
        {/* Your content */}
      </main>
      
      <Footer />
    </div>
  );
}

// Accessible at /my-page
```

### Creating a New API Endpoint

```typescript
// 1. Create file: app/api/my-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { withAuth } from '@/middleware/auth';

// Public endpoint
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const data = await db.collection('myCollection').find().toArray();
    
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// Protected endpoint
export const POST = withAuth(async (request: NextRequest, user) => {
  const body = await request.json();
  
  // User is authenticated, user object available
  
  return NextResponse.json({ success: true });
});
```

### Adding a New Shared Component

```typescript
// 1. Create file: components/shared/MyComponent.tsx
import { memo } from 'react';
import { cn } from '@/lib/utils';

interface MyComponentProps {
  title: string;
  className?: string;
}

export const MyComponent = memo(function MyComponent({
  title,
  className
}: MyComponentProps) {
  return (
    <div className={cn('p-4 rounded-lg', className)}>
      <h2>{title}</h2>
    </div>
  );
});

// 2. Use it anywhere
import { MyComponent } from '@/components/shared/MyComponent';

<MyComponent title="Hello" className="bg-gray-100" />
```

### Adding Form Validation

```typescript
import { useState } from 'react';
import { FormInput } from '@/components/forms/FormInput';
import { isValidEmail } from '@/lib/utils/validators';

function MyForm() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Invalid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Submit form
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        required
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

---

## Common Patterns

### Pattern 1: Fetching and Displaying Data

```typescript
'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client-optimized';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import type { Part } from '@/types';

export default function PartsListPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchParts();
  }, []);
  
  const fetchParts = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getParts();
      setParts(data.parts);
    } catch (err) {
      setError('Failed to load parts');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;
  if (parts.length === 0) return <EmptyState title="No parts found" />;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {parts.map(part => (
        <PartCard key={part._id} part={part} />
      ))}
    </div>
  );
}
```

### Pattern 2: Search with Debouncing

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchBar } from '@/components/shared/SearchBar';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    if (debouncedQuery) {
      searchParts(debouncedQuery);
    }
  }, [debouncedQuery]);
  
  const searchParts = async (searchTerm: string) => {
    const data = await apiClient.getParts({ search: searchTerm });
    setResults(data.parts);
  };
  
  return (
    <div>
      <SearchBar
        onSearch={setQuery}
        placeholder="Search parts..."
      />
      {/* Display results */}
    </div>
  );
}
```

### Pattern 3: Pagination

```typescript
'use client';

import { useState } from 'react';
import { Pagination } from '@/components/shared/Pagination';

export default function PaginatedList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  
  const fetchPage = async (page: number) => {
    const data = await apiClient.getParts({ page, limit: 20 });
    // Update data
    setTotalPages(data.pagination.totalPages);
  };
  
  useEffect(() => {
    fetchPage(currentPage);
  }, [currentPage]);
  
  return (
    <div>
      {/* Display data */}
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
```

### Pattern 4: Form Submission

```typescript
'use client';

import { useState } from 'react';
import { FormInput } from '@/components/forms/FormInput';
import { toast } from 'sonner';

export default function MyForm() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await apiClient.createSomething(formData);
      toast.success('Success!');
      // Reset form or redirect
    } catch (error) {
      toast.error('Failed to submit');
      setErrors(error.errors || {});
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
}
```

### Pattern 5: Protected Content

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <div>Please login</div>;
  
  // Check role
  if (user.role !== 'admin') {
    return <div>Access denied</div>;
  }
  
  return <div>Admin content</div>;
}
```

---

## Troubleshooting

### Common Issues

#### 1. API Call Fails
```typescript
// Problem: Request returns 401 Unauthorized
// Solution: Token expired or not set

// Check token
const token = localStorage.getItem('accessToken');
if (!token) {
  // User needs to login
  router.push('/login');
}

// Force refresh
await apiClient.refreshAccessToken();
```

#### 2. Component Not Re-rendering
```typescript
// Problem: State updates but UI doesn't change
// Solution: Check if you're mutating state directly

// ❌ Wrong - mutating array directly
items.push(newItem);
setItems(items);

// ✅ Correct - create new array
setItems([...items, newItem]);
```

#### 3. Hydration Mismatch
```typescript
// Problem: Server/client HTML mismatch
// Solution: Use client-only rendering for dynamic content

// ❌ Wrong - uses current time on server and client
const time = new Date().toISOString();

// ✅ Correct - only render on client
const [time, setTime] = useState('');
useEffect(() => {
  setTime(new Date().toISOString());
}, []);
```

#### 4. Image Not Loading
```typescript
// Problem: Image 404 or won't display
// Solution: Check path and use Image component

// ❌ Wrong
<img src="image.jpg" />

// ✅ Correct
import Image from 'next/image';
<Image src="/image.jpg" alt="Description" width={400} height={300} />

// Or use ImageWithFallback
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';
<ImageWithFallback src="/image.jpg" alt="Desc" width={400} height={300} />
```

#### 5. TypeScript Errors
```typescript
// Problem: Type errors in components
// Solution: Import and use correct types

import type { Part, User, Order } from '@/types';

// Define component props properly
interface MyComponentProps {
  part: Part;
  onSelect: (part: Part) => void;
}

function MyComponent({ part, onSelect }: MyComponentProps) {
  // ...
}
```

---

## Deployment

### Building for Production

```bash
# 1. Install dependencies
npm install

# 2. Build the application
npm run build

# 3. Start production server
npm start
```

### Environment Variables

Required environment variables:
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/autoparts

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@amodistribution.mu

# App URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

### Docker Deployment

```bash
# Build image
docker build -t autoparts-app .

# Run container
docker run -p 3000:3000 --env-file .env autoparts-app

# Or use docker-compose
docker-compose up -d
```

---

## Best Practices

### 1. Component Design
- Keep components small and focused
- Use TypeScript for type safety
- Memoize expensive components
- Use proper prop types

### 2. State Management
- Use Context for global state
- Use local state for UI state
- Avoid prop drilling
- Keep state close to where it's used

### 3. Performance
- Use dynamic imports for code splitting
- Implement proper loading states
- Cache API responses
- Optimize images with Next.js Image

### 4. Error Handling
- Always wrap API calls in try/catch
- Show user-friendly error messages
- Log errors for debugging
- Use Error Boundaries

### 5. Accessibility
- Use semantic HTML
- Add ARIA labels
- Ensure keyboard navigation
- Test with screen readers

---

## Quick Reference

### Most Used Imports
```typescript
// Components
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { FormInput } from '@/components/forms/FormInput';

// Hooks
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useDebounce } from '@/hooks/useDebounce';

// API
import { apiClient } from '@/lib/api-client-optimized';

// Utils
import { formatPrice } from '@/lib/utils/formatters';
import { isValidEmail } from '@/lib/utils/validators';
import { CAR_MAKES, CONTACT_INFO } from '@/lib/constants';

// Types
import type { Part, User, Order } from '@/types';

// Toast notifications
import { toast } from 'sonner';
```

### Keyboard Shortcuts (Development)
- `Ctrl+C` - Stop dev server
- `Ctrl+S` - Save and hot reload
- `Ctrl+Shift+P` - Command palette (VS Code)

---

## Summary

This documentation covers:
- ✅ Architecture and structure
- ✅ Component system
- ✅ API endpoints
- ✅ State management
- ✅ Authentication
- ✅ Order processing
- ✅ Common patterns
- ✅ Troubleshooting
- ✅ Best practices

For more details:
- `REFACTORING_SUMMARY.md` - Technical refactoring details
- `IMPLEMENTATION_GUIDE.md` - Step-by-step implementation
- Inline code comments - Component-specific documentation

---

**Happy Coding! 🚀**

