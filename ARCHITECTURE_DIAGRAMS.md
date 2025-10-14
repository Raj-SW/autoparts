# 🏗️ Architecture Diagrams & Visual Guide

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Data Flow Diagrams](#data-flow-diagrams)
3. [Component Hierarchy](#component-hierarchy)
4. [API Request Flow](#api-request-flow)
5. [Authentication Flow](#authentication-flow)
6. [Order Processing Flow](#order-processing-flow)
7. [File Organization](#file-organization)

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React Components (Next.js)              │   │
│  │                                                      │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌─────────┐  │   │
│  │  │ Pages  │  │ Comps  │  │ Hooks  │  │Contexts │  │   │
│  │  └───┬────┘  └───┬────┘  └───┬────┘  └────┬────┘  │   │
│  │      └───────────┴───────────┴─────────────┘       │   │
│  │                      │                              │   │
│  │              ┌───────▼────────┐                     │   │
│  │              │  API Client    │                     │   │
│  │              │  (Optimized)   │                     │   │
│  │              └───────┬────────┘                     │   │
│  └──────────────────────┼───────────────────────────────┘   │
│                         │                                   │
│                         │ HTTP/HTTPS                        │
└─────────────────────────┼───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    NEXT.JS SERVER                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  API Routes Layer                    │   │
│  │                                                      │   │
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐ │   │
│  │  │ Auth │  │Parts │  │Orders│  │Quotes│  │Admin │ │   │
│  │  └──┬───┘  └──┬───┘  └──┬───┘  └──┬───┘  └──┬───┘ │   │
│  │     └─────────┴─────────┴─────────┴─────────┘      │   │
│  │                      │                              │   │
│  │              ┌───────▼────────┐                     │   │
│  │              │   Middleware   │                     │   │
│  │              │  (Auth, CORS)  │                     │   │
│  │              └───────┬────────┘                     │   │
│  └──────────────────────┼───────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │              Business Logic Layer                    │   │
│  │                                                      │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │ Services │  │ Utils    │  │ Helpers  │          │   │
│  │  └──────────┘  └──────────┘  └──────────┘          │   │
│  └──────────────────────┬───────────────────────────────┘   │
└─────────────────────────┼───────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
┌───────▼───────┐  ┌──────▼──────┐  ┌──────▼───────┐
│   MongoDB     │  │   Stripe    │  │  Cloudinary  │
│   Database    │  │   Payment   │  │   Images     │
└───────────────┘  └─────────────┘  └──────────────┘
```

---

## Data Flow Diagrams

### 1. User Views Parts (GET Request)

```
┌──────────┐
│  User    │
│  Opens   │
│ /catalog │
└────┬─────┘
     │
     ▼
┌─────────────────────┐
│ CatalogPage.tsx     │  ← Client Component
│                     │
│ useEffect(() => {   │
│   fetchParts()      │
│ }, [])              │
└─────┬───────────────┘
      │
      ▼
┌─────────────────────┐
│ apiClient.getParts()│  ← API Client
│                     │
│ • Check cache       │
│ • Dedupe requests   │
└─────┬───────────────┘
      │ GET /api/parts?page=1
      ▼
┌─────────────────────┐
│ /api/parts/route.ts │  ← API Route
│                     │
│ export async        │
│ function GET(req) { │
└─────┬───────────────┘
      │
      ▼
┌─────────────────────┐
│ getDatabase()       │  ← MongoDB Connection
│                     │
│ db.collection       │
│   ('parts')         │
│   .find()           │
└─────┬───────────────┘
      │
      ▼ [Part[], Part[], ...]
┌─────────────────────┐
│ Process & Format    │
│ • Apply filters     │
│ • Pagination        │
│ • Sort results      │
└─────┬───────────────┘
      │
      ▼ JSON Response
┌─────────────────────┐
│ Return to Client    │
│ {                   │
│   parts: [...],     │
│   total: 42,        │
│   pagination: {...} │
│ }                   │
└─────┬───────────────┘
      │
      ▼
┌─────────────────────┐
│ Update State        │
│ setParts(data)      │
│                     │
│ • Cache response    │
│ • Render UI         │
└─────────────────────┘
```

### 2. User Adds to Cart (State Update)

```
┌──────────┐
│  User    │
│  Clicks  │
│"Add Cart"│
└────┬─────┘
     │
     ▼
┌─────────────────────┐
│ PartCard.tsx        │
│                     │
│ onClick={() => {    │
│   handleAddToCart() │
│ }}                  │
└─────┬───────────────┘
      │
      ▼
┌─────────────────────┐
│ CartContext         │  ← Global State
│                     │
│ addItem({           │
│   id,               │
│   name,             │
│   price,            │
│   quantity: 1       │
│ })                  │
└─────┬───────────────┘
      │
      ├──────────────────────┐
      │                      │
      ▼                      ▼
┌──────────────┐    ┌────────────────┐
│ Update State │    │   localStorage │
│              │    │                │
│ setItems([   │    │ setItem('cart',│
│   ...items,  │    │  JSON.stringify│
│   newItem    │    │  (items))      │
│ ])           │    │                │
└──────┬───────┘    └────────────────┘
       │
       ▼
┌─────────────────────┐
│ React Re-render     │
│                     │
│ • Cart badge updates│
│ • Button disabled   │
│ • Toast shown       │
└─────────────────────┘
```

### 3. User Checkout & Payment

```
┌──────────┐
│  User    │
│ Proceeds │
│Checkout  │
└────┬─────┘
     │
     ▼
┌─────────────────────┐
│ /checkout page      │
│                     │
│ • Show cart items   │
│ • Shipping form     │
│ • Payment form      │
└─────┬───────────────┘
      │ User fills form
      ▼
┌─────────────────────┐
│ Create Payment      │
│ Intent              │
│                     │
│ POST /api/payment/  │
│   create-intent     │
└─────┬───────────────┘
      │
      ▼
┌─────────────────────┐
│ Stripe API          │  ← External Service
│                     │
│ • Creates intent    │
│ • Returns secret    │
└─────┬───────────────┘
      │ clientSecret
      ▼
┌─────────────────────┐
│ StripePaymentForm   │
│                     │
│ • Card input        │
│ • Confirm payment   │
└─────┬───────────────┘
      │ Payment confirmed
      ▼
┌─────────────────────┐
│ Create Order        │
│                     │
│ POST /api/orders    │
│ {                   │
│   items: [...],     │
│   total: 5000,      │
│   paymentIntentId   │
│ }                   │
└─────┬───────────────┘
      │
      ├──────────────────────┐
      │                      │
      ▼                      ▼
┌──────────────┐    ┌────────────────┐
│ Save to DB   │    │ Send Email     │
│              │    │                │
│ MongoDB      │    │ Nodemailer     │
│ orders       │    │ • Confirmation │
│ collection   │    │ • Invoice PDF  │
└──────┬───────┘    └────────────────┘
       │
       ▼
┌─────────────────────┐
│ Clear Cart          │
│                     │
│ CartContext.clear() │
│ localStorage.clear()│
└─────┬───────────────┘
      │
      ▼
┌─────────────────────┐
│ Redirect Success    │
│                     │
│ /checkout/success   │
│ ?orderNumber=ORD123 │
└─────────────────────┘
```

---

## Component Hierarchy

### Page Structure

```
RootLayout (app/layout.tsx)
│
├── Providers
│   ├── AuthProvider (AuthContext)
│   └── CartProvider (CartContext)
│
└── Page Content
    │
    ├── Navigation
    │   ├── Logo
    │   ├── Menu Items
    │   ├── Search Bar
    │   ├── Cart Badge
    │   └── User Menu
    │
    ├── Main Content (varies by page)
    │   │
    │   ├── HomePage
    │   │   ├── UrgencyBanner
    │   │   ├── HeroSection
    │   │   ├── TrustSignals
    │   │   ├── FlashDealsSection
    │   │   ├── ProblemSolutionSection
    │   │   ├── FeaturedParts
    │   │   ├── PriceComparison
    │   │   ├── SmartFeatures
    │   │   └── TestimonialsCarousel
    │   │
    │   ├── CatalogPage
    │   │   ├── PageHeader
    │   │   ├── SearchBar
    │   │   ├── FilterPanel
    │   │   ├── PartsGrid
    │   │   │   └── PartCard (repeated)
    │   │   └── Pagination
    │   │
    │   ├── CheckoutPage
    │   │   ├── CartSummary
    │   │   ├── ShippingForm
    │   │   └── StripePaymentForm
    │   │
    │   └── DashboardPage
    │       ├── StatsCards
    │       ├── RecentOrders
    │       └── QuickActions
    │
    └── Footer
        ├── Contact Info
        ├── Links
        └── Social Media
```

### Shared Components Tree

```
Shared Components
│
├── LoadingSpinner
│   ├── size: 'sm' | 'md' | 'lg'
│   └── text?: string
│
├── ErrorBoundary
│   └── children: ReactNode
│
├── EmptyState
│   ├── icon?: ReactNode
│   ├── title: string
│   ├── description?: string
│   └── action?: { label, onClick }
│
├── PageHeader
│   ├── title: string
│   ├── description?: string
│   ├── badge?: ReactNode
│   └── actions?: ReactNode
│
├── PriceDisplay
│   ├── price: number
│   ├── currency?: string
│   ├── originalPrice?: number
│   └── showDiscount?: boolean
│
├── StockBadge
│   ├── stock: number
│   └── lowStockThreshold?: number
│
├── RatingDisplay
│   ├── rating: number
│   ├── maxRating?: number
│   └── showValue?: boolean
│
├── SearchBar
│   ├── placeholder?: string
│   ├── onSearch: (query) => void
│   └── debounceMs?: number
│
├── ImageWithFallback
│   ├── src: string
│   ├── alt: string
│   ├── fallbackSrc?: string
│   └── Next.js Image props
│
└── Pagination
    ├── currentPage: number
    ├── totalPages: number
    └── onPageChange: (page) => void
```

---

## API Request Flow

### Request Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│                  1. CLIENT INITIATES                     │
│                                                          │
│  Component calls: apiClient.getParts()                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│               2. API CLIENT PROCESSING                   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Check Cache                                    │   │
│  │  • Key: 'GET-/api/parts'                       │   │
│  │  • Age: < 5 minutes?                           │   │
│  │  • YES → Return cached data                    │   │
│  │  • NO  → Continue                              │   │
│  └─────────────┬───────────────────────────────────┘   │
│                │                                        │
│  ┌─────────────▼───────────────────────────────────┐   │
│  │  Check Request Queue                            │   │
│  │  • Same request in flight?                     │   │
│  │  • YES → Wait for existing request             │   │
│  │  • NO  → Continue                              │   │
│  └─────────────┬───────────────────────────────────┘   │
│                │                                        │
│  ┌─────────────▼───────────────────────────────────┐   │
│  │  Prepare Request                                │   │
│  │  • Add auth header if token exists             │   │
│  │  • Set content-type                            │   │
│  │  • Build URL with params                       │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │ fetch()
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  3. API ROUTE HANDLER                    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Middleware Check (if protected)                │   │
│  │  • Verify JWT token                            │   │
│  │  • Check token expiry                          │   │
│  │  • Validate user role                          │   │
│  │  • Reject if invalid                           │   │
│  └─────────────┬───────────────────────────────────┘   │
│                │ Authorized                             │
│                ▼                                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Validate Request                               │   │
│  │  • Parse query params                          │   │
│  │  • Validate with Zod (if schema)               │   │
│  │  • Sanitize inputs                             │   │
│  └─────────────┬───────────────────────────────────┘   │
│                │ Valid                                  │
│                ▼                                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Business Logic                                 │   │
│  │  • Build database query                        │   │
│  │  • Apply filters, sorting, pagination          │   │
│  │  • Execute query                               │   │
│  └─────────────┬───────────────────────────────────┘   │
└────────────────┬────────────────────────────────────────┘
                 │ Query result
                 ▼
┌─────────────────────────────────────────────────────────┐
│                    4. DATABASE QUERY                     │
│                                                          │
│  MongoDB                                                │
│  • Find documents matching query                        │
│  • Apply sort, skip, limit                              │
│  • Return results                                       │
└────────────────┬────────────────────────────────────────┘
                 │ [documents]
                 ▼
┌─────────────────────────────────────────────────────────┐
│                5. RESPONSE FORMATTING                    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Transform Data                                 │   │
│  │  • Convert ObjectId to string                  │   │
│  │  • Format dates                                │   │
│  │  • Remove sensitive fields                     │   │
│  └─────────────┬───────────────────────────────────┘   │
│                │                                        │
│                ▼                                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Build Response                                 │   │
│  │  {                                              │   │
│  │    parts: [...],                               │   │
│  │    total: 42,                                  │   │
│  │    pagination: {                               │   │
│  │      page: 1,                                  │   │
│  │      totalPages: 3                             │   │
│  │    }                                           │   │
│  │  }                                              │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────┬────────────────────────────────────────┘
                 │ JSON response
                 ▼
┌─────────────────────────────────────────────────────────┐
│                 6. CLIENT RECEIVES                       │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  API Client Post-Processing                     │   │
│  │  • Cache response                               │   │
│  │  • Remove from request queue                   │   │
│  │  • Return data to component                    │   │
│  └─────────────┬───────────────────────────────────┘   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│               7. COMPONENT UPDATES                       │
│                                                          │
│  • State updated: setParts(data.parts)                  │
│  • React re-renders                                     │
│  • UI displays parts                                    │
└─────────────────────────────────────────────────────────┘
```

### Error Handling Flow

```
┌──────────────┐
│ Error Occurs │
└──────┬───────┘
       │
       ├─────────────────────────────────┐
       │                                 │
       ▼                                 ▼
┌──────────────┐              ┌──────────────────┐
│ Network Error│              │ Server Error     │
│              │              │ (500, 400, etc.) │
└──────┬───────┘              └────────┬─────────┘
       │                               │
       ▼                               ▼
┌─────────────────────────────────────────────┐
│          API Client Catches Error            │
│                                              │
│  catch (error) {                            │
│    if (error.status === 401) {              │
│      // Try to refresh token                │
│      refreshAccessToken()                   │
│    } else {                                 │
│      // Transform error message             │
│      throw new Error(userMessage)           │
│    }                                        │
│  }                                          │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│        Component Catches Error               │
│                                              │
│  catch (error) {                            │
│    setError(error.message)                  │
│    toast.error(error.message)               │
│  } finally {                                │
│    setLoading(false)                        │
│  }                                          │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│              UI Updates                      │
│                                              │
│  • Loading spinner removed                  │
│  • Error message displayed                  │
│  • Toast notification shown                 │
│  • User can retry                           │
└─────────────────────────────────────────────┘
```

---

## Authentication Flow

### Login Process

```
User enters credentials
        │
        ▼
┌───────────────────┐
│ Login Form        │
│ • Email           │
│ • Password        │
└────────┬──────────┘
         │ onSubmit
         ▼
┌───────────────────────┐
│ Client Validation     │
│ • Check email format  │
│ • Check password len  │
└────────┬──────────────┘
         │ Valid
         ▼
┌───────────────────────┐
│ AuthContext.login()   │
│                       │
│ await apiClient.login(│
│   email, password     │
│ )                     │
└────────┬──────────────┘
         │ POST /api/auth/login
         ▼
┌───────────────────────┐
│ API Route Handler     │
│                       │
│ 1. Find user by email │
│ 2. Compare password   │
│    bcrypt.compare()   │
└────────┬──────────────┘
         │ Match
         ▼
┌───────────────────────┐
│ Generate Tokens       │
│                       │
│ accessToken = jwt.sign│
│   ({ userId, role },  │
│   SECRET,             │
│   { expiresIn:'15m'}) │
│                       │
│ refreshToken = jwt... │
│   { expiresIn:'7d' }  │
└────────┬──────────────┘
         │
         ▼
┌───────────────────────┐
│ Return Response       │
│ {                     │
│   user: {             │
│     id, name, email,  │
│     role              │
│   },                  │
│   tokens: {           │
│     accessToken,      │
│     refreshToken      │
│   }                   │
│ }                     │
└────────┬──────────────┘
         │
         ▼
┌───────────────────────┐
│ API Client Stores     │
│                       │
│ localStorage.setItem( │
│   'accessToken',      │
│   tokens.accessToken  │
│ )                     │
│ localStorage.setItem( │
│   'refreshToken',     │
│   tokens.refreshToken │
│ )                     │
└────────┬──────────────┘
         │
         ▼
┌───────────────────────┐
│ AuthContext Updates   │
│                       │
│ setUser(response.user)│
└────────┬──────────────┘
         │
         ▼
┌───────────────────────┐
│ Redirect User         │
│                       │
│ if (role === 'admin') │
│   router.push('/admin│
│ else                  │
│   router.push(        │
│     '/dashboard')     │
└───────────────────────┘
```

### Token Refresh Flow

```
API Request with expired token
        │
        ▼
┌───────────────────────┐
│ Server Response       │
│ 401 Unauthorized      │
└────────┬──────────────┘
         │
         ▼
┌───────────────────────┐
│ API Client Detects    │
│                       │
│ if (status === 401 && │
│     hasRefreshToken)  │
└────────┬──────────────┘
         │ Yes
         ▼
┌───────────────────────┐
│ Refresh Token Request │
│                       │
│ POST /api/auth/refresh│
│ {                     │
│   refreshToken: ...   │
│ }                     │
└────────┬──────────────┘
         │
         ▼
┌───────────────────────┐
│ Verify Refresh Token  │
│                       │
│ jwt.verify(           │
│   refreshToken,       │
│   REFRESH_SECRET      │
│ )                     │
└────────┬──────────────┘
         │ Valid
         ▼
┌───────────────────────┐
│ Generate New Tokens   │
│                       │
│ • New accessToken     │
│ • New refreshToken    │
└────────┬──────────────┘
         │
         ▼
┌───────────────────────┐
│ Update Stored Tokens  │
│                       │
│ localStorage.setItem()│
└────────┬──────────────┘
         │
         ▼
┌───────────────────────┐
│ Retry Original Request│
│                       │
│ with new accessToken  │
└────────┬──────────────┘
         │
         ▼
┌───────────────────────┐
│ Success!              │
│ User doesn't notice   │
│ the refresh happened  │
└───────────────────────┘
```

---

## Order Processing Flow

### Complete Order Lifecycle

```
┌─────────────┐
│ Cart Items  │
│ • Part A    │
│ • Part B    │
│ • Part C    │
└──────┬──────┘
       │ User clicks "Checkout"
       ▼
┌──────────────────────┐
│ Checkout Page        │
│ • Review items       │
│ • Enter shipping     │
│ • Calculate totals   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Create Payment Intent│
│ POST /api/payment/   │
│   create-intent      │
│                      │
│ Stripe.createIntent({│
│   amount: totalInMUR,│
│   currency: 'mur'    │
│ })                   │
└──────┬───────────────┘
       │ clientSecret
       ▼
┌──────────────────────┐
│ Payment Form         │
│ • Card details       │
│ • Stripe Elements    │
└──────┬───────────────┘
       │ User pays
       ▼
┌──────────────────────┐
│ Stripe Processes     │
│ • Validates card     │
│ • Charges amount     │
│ • Returns success    │
└──────┬───────────────┘
       │ paymentIntent
       ▼
┌──────────────────────┐
│ Create Order         │
│ POST /api/orders     │
│                      │
│ {                    │
│   items,             │
│   total,             │
│   shippingAddress,   │
│   paymentIntentId    │
│ }                    │
└──────┬───────────────┘
       │
       ├─────────────────────────────┐
       │                             │
       ▼                             ▼
┌──────────────┐           ┌─────────────────┐
│ Save to DB   │           │ Generate PDF    │
│              │           │                 │
│ MongoDB      │           │ Puppeteer       │
│ {            │           │ • Invoice       │
│   orderNum,  │           │ • Order details │
│   status:    │           │                 │
│   'pending', │           └────────┬────────┘
│   ...        │                    │
│ }            │                    │
└──────┬───────┘                    │
       │                            │
       └───────────┬────────────────┘
                   │
                   ▼
           ┌───────────────┐
           │ Send Email    │
           │               │
           │ Nodemailer    │
           │ • To customer │
           │ • Attach PDF  │
           │ • CC admin    │
           └───────┬───────┘
                   │
                   ▼
           ┌───────────────┐
           │ Update Stock  │
           │               │
           │ For each item:│
           │ decrease stock│
           └───────┬───────┘
                   │
                   ▼
           ┌───────────────┐
           │ Clear Cart    │
           │               │
           │ CartContext   │
           │ .clearCart()  │
           └───────┬───────┘
                   │
                   ▼
           ┌───────────────┐
           │ Show Success  │
           │               │
           │ /checkout/    │
           │ success?order=│
           │ ORD-2024-001  │
           └───────────────┘
```

---

## File Organization

### Dependency Graph

```
┌──────────────────────────────────────────────────┐
│                     PAGES                         │
│  app/page.tsx, app/catalog/page.tsx, etc.       │
└────────────┬─────────────────────────────────────┘
             │ imports
             ▼
┌──────────────────────────────────────────────────┐
│              PAGE COMPONENTS                      │
│  app/components/home/, Navigation.tsx, etc.      │
└────────────┬─────────────────────────────────────┘
             │ imports
             ▼
┌──────────────────────────────────────────────────┐
│             SHARED COMPONENTS                     │
│  components/shared/, components/forms/           │
└────────────┬─────────────────────────────────────┘
             │ imports
             ├─────────────────┬───────────────────┐
             │                 │                   │
             ▼                 ▼                   ▼
┌──────────────┐    ┌───────────────┐    ┌─────────────┐
│     UI       │    │   CONTEXTS    │    │   HOOKS     │
│ components/  │    │  contexts/    │    │   hooks/    │
│    ui/       │    │ AuthContext   │    │ useDebounce │
│  Button,     │    │ CartContext   │    │ useAsync    │
│  Card, etc.  │    └───────┬───────┘    └─────┬───────┘
└──────┬───────┘            │                   │
       │                    │                   │
       │  imports           │ imports           │ imports
       └────────────────────┴───────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────┐
│                 UTILITIES                         │
│  lib/utils/, lib/constants/                     │
│  formatters, validators, constants               │
└────────────┬─────────────────────────────────────┘
             │ uses
             ▼
┌──────────────────────────────────────────────────┐
│                   TYPES                           │
│  types/index.ts                                  │
│  TypeScript interfaces and types                 │
└──────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────┐
│               SEPARATE: API                       │
│                                                   │
│  app/api/*/route.ts                              │
│       │                                           │
│       ├─→ middleware/auth.ts                     │
│       ├─→ lib/db/mongodb.ts                      │
│       ├─→ models/*.ts                            │
│       └─→ lib/utils/*                            │
└──────────────────────────────────────────────────┘
```

### Import Path Examples

```typescript
// Components
import Navigation from '@/app/components/Navigation';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/forms/FormInput';

// Contexts & Hooks
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useDebounce } from '@/hooks/useDebounce';

// Utilities
import { formatPrice } from '@/lib/utils/formatters';
import { isValidEmail } from '@/lib/utils/validators';
import { CAR_MAKES } from '@/lib/constants';
import { cn } from '@/lib/utils';

// API Client
import { apiClient } from '@/lib/api-client-optimized';

// Types
import type { Part, User, Order } from '@/types';

// Models (API routes only)
import { User } from '@/models/User';
import { Part } from '@/models/Part';
```

---

## Summary

This visual guide covers:
- ✅ System architecture with detailed diagrams
- ✅ Complete data flow for all operations
- ✅ Component hierarchy visualization
- ✅ API request lifecycle
- ✅ Authentication flow diagrams
- ✅ Order processing workflow
- ✅ File organization and dependencies

Use this alongside `COMPREHENSIVE_DOCUMENTATION.md` for complete understanding.

---

**Navigate with Confidence! 🗺️**

