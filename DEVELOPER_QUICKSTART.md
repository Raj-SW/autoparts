# 🚀 Developer Quick Start Guide

> Get up and running with the A.M.O Auto Parts codebase in 15 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB running (local or cloud)
- Code editor (VS Code recommended)
- Basic knowledge of React/Next.js

---

## ⚡ Quick Setup (5 minutes)

### 1. Clone & Install
```bash
# Clone the repository
git clone <repository-url>
cd autoparts

# Install dependencies
npm install
```

### 2. Environment Setup
```bash
# Create environment file
cp .env.example .env

# Edit .env with your values (minimum required):
# MONGODB_URI=mongodb://localhost:27017/autoparts
# JWT_SECRET=your-secret-key-here
# JWT_REFRESH_SECRET=your-refresh-secret-here
```

### 3. Seed Database (Optional)
```bash
# Add car body parts data
npm run seed:body-parts
```

### 4. Start Development
```bash
# Start dev server
npm run dev

# Open browser
# http://localhost:3000
```

✅ **Done! Your app should be running.**

---

## 📖 Essential Reading (10 minutes)

### Must-Read Files (in this order):

1. **COMPREHENSIVE_DOCUMENTATION.md** (5 min) - Overview and concepts
2. **ARCHITECTURE_DIAGRAMS.md** (3 min) - Visual understanding
3. **This file** (2 min) - Common tasks

### Project Structure Quick Reference

```
autoparts/
├── app/                    # Pages & API routes
│   ├── api/               # Backend endpoints
│   ├── catalog/           # Parts catalog
│   └── page.tsx           # Homepage
│
├── components/            # Reusable components
│   ├── shared/           # UI components
│   ├── forms/            # Form components
│   └── ui/               # Base components
│
├── lib/                   # Utilities & helpers
│   ├── constants/        # App constants
│   └── utils/            # Helper functions
│
├── contexts/              # Global state
│   ├── AuthContext.tsx   # Authentication
│   └── CartContext.tsx   # Shopping cart
│
└── types/                 # TypeScript types
```

---

## 🔧 Common Tasks

### Task 1: Create a New Page

```bash
# 1. Create file
touch app/my-page/page.tsx
```

```typescript
// 2. Add code
'use client';

import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';

export default function MyPage() {
  return (
    <div>
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1>My New Page</h1>
      </main>
      <Footer />
    </div>
  );
}
```

```bash
# 3. Access at http://localhost:3000/my-page
```

### Task 2: Create an API Endpoint

```typescript
// app/api/my-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello!' });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}

// Access: GET http://localhost:3000/api/my-endpoint
```

### Task 3: Use Existing Components

```typescript
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { Button } from '@/components/ui/button';

function MyComponent() {
  return (
    <div>
      <LoadingSpinner size="lg" />
      <PriceDisplay price={2500} currency="MUR" />
      <Button onClick={() => alert('Clicked!')}>
        Click Me
      </Button>
    </div>
  );
}
```

### Task 4: Fetch Data from API

```typescript
'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client-optimized';

function MyDataComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await apiClient.getParts();
        setData(result.parts);
      } catch (error) {
        console.error('Failed:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {data.map(item => (
        <div key={item._id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### Task 5: Use Authentication

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

function ProtectedComponent() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Task 6: Add to Cart

```typescript
'use client';

import { useCart } from '@/contexts/CartContext';

function ProductCard({ part }) {
  const { addItem, isInCart } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: part._id,
      name: part.name,
      price: part.price,
      stock: part.stock,
    });
  };

  return (
    <div>
      <h3>{part.name}</h3>
      <p>Rs {part.price}</p>
      <button 
        onClick={handleAddToCart}
        disabled={isInCart(part._id)}
      >
        {isInCart(part._id) ? 'In Cart' : 'Add to Cart'}
      </button>
    </div>
  );
}
```

### Task 7: Format Data

```typescript
import { 
  formatPrice, 
  formatDate, 
  formatPhoneNumber 
} from '@/lib/utils/formatters';

// Format price
const price = formatPrice(2500, 'MUR'); // "Rs 2,500"

// Format date
const date = formatDate(new Date()); // "Jan 15, 2024"

// Format phone
const phone = formatPhoneNumber('57123456'); // "+230 5712 3456"
```

### Task 8: Validate Input

```typescript
import { 
  isValidEmail, 
  validatePassword 
} from '@/lib/utils/validators';

// Check email
if (!isValidEmail(email)) {
  setError('Invalid email');
}

// Check password
const result = validatePassword(password);
if (!result.isValid) {
  setErrors(result.errors);
}
```

### Task 9: Use Constants

```typescript
import { 
  CAR_MAKES, 
  PART_CATEGORIES,
  CONTACT_INFO 
} from '@/lib/constants';

// Dropdown options
<select>
  {CAR_MAKES.map(make => (
    <option key={make} value={make}>{make}</option>
  ))}
</select>

// Contact info
<a href={`tel:${CONTACT_INFO.PHONE}`}>Call Us</a>
```

### Task 10: Create a Form

```typescript
import { FormInput } from '@/components/forms/FormInput';
import { FormSelect } from '@/components/forms/FormSelect';

function MyForm() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        required
      />
      
      <FormSelect
        label="Category"
        options={[
          { value: 'engine', label: 'Engine' },
          { value: 'brake', label: 'Brake' }
        ]}
        value={category}
        onValueChange={setCategory}
        error={errors.category}
      />
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## 🎨 Styling Quick Tips

### Tailwind Classes (Mobile-First)

```typescript
// Responsive padding
<div className="p-4 md:p-6 lg:p-8">
  
// Responsive text
<div className="text-sm md:text-base lg:text-lg">
  
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  
// Responsive flex
<div className="flex flex-col md:flex-row gap-4">
```

### Using cn() Utility

```typescript
import { cn } from '@/lib/utils';

// Merge classes conditionally
<div className={cn(
  'p-4 rounded',
  isActive && 'bg-blue-500',
  isDisabled && 'opacity-50',
  className // Accept className prop
)}>
```

---

## 🐛 Debugging Tips

### 1. Check Browser Console
```bash
# Open DevTools
# Mac: Cmd + Option + I
# Windows: F12
```

### 2. Check Network Requests
```bash
# DevTools > Network tab
# Look for failed requests (red)
# Click to see details
```

### 3. Check API Responses
```typescript
// Add console.log to see data
const data = await apiClient.getParts();
console.log('API Response:', data);
```

### 4. Check Auth State
```typescript
const { user } = useAuth();
console.log('Current user:', user);
console.log('Token:', localStorage.getItem('accessToken'));
```

### 5. Clear Cache
```typescript
// Clear API cache
import { apiClient } from '@/lib/api-client-optimized';
apiClient.clearCache();

// Clear localStorage
localStorage.clear();
```

---

## 📚 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run seed:body-parts  # Seed body parts

# Docker
npm run docker:dev       # Start with Docker
npm run docker:dev:stop  # Stop Docker containers

# Linting
npm run lint             # Check for issues
```

---

## 🆘 Getting Help

### If Something Breaks:

1. **Read the error message** - It usually tells you what's wrong
2. **Check the console** - Browser and terminal
3. **Read the docs** - COMPREHENSIVE_DOCUMENTATION.md
4. **Check the diagrams** - ARCHITECTURE_DIAGRAMS.md
5. **Look at similar code** - Find working examples in the codebase

### Common Issues:

| Issue | Solution |
|-------|----------|
| Page not loading | Check if dev server is running |
| API fails | Check MongoDB connection & .env |
| Can't import component | Check path uses `@/` prefix |
| TypeScript errors | Import types from `@/types` |
| Styles not working | Check Tailwind classes syntax |
| Authentication fails | Clear localStorage & try again |

---

## 🎯 Next Steps

Now that you're set up:

1. ✅ Browse the existing pages
2. ✅ Try the catalog and cart features
3. ✅ Create a test page
4. ✅ Create a test API endpoint
5. ✅ Read COMPREHENSIVE_DOCUMENTATION.md
6. ✅ Experiment with components

---

## 🔗 Important Files to Bookmark

- **COMPREHENSIVE_DOCUMENTATION.md** - Complete reference
- **ARCHITECTURE_DIAGRAMS.md** - Visual guides
- **IMPLEMENTATION_GUIDE.md** - Usage examples
- **REFACTORING_SUMMARY.md** - What was changed
- **types/index.ts** - All TypeScript types
- **lib/constants/index.ts** - All constants

---

## 💡 Pro Tips

1. **Use TypeScript** - It catches errors before runtime
2. **Import types** - Always import types for props
3. **Use shared components** - Don't recreate common UI
4. **Use constants** - Import from `@/lib/constants`
5. **Use formatters** - Import from `@/lib/utils/formatters`
6. **Check examples** - Look at existing components
7. **Keep components small** - One responsibility per component
8. **Use error boundaries** - Wrap risky components
9. **Test on mobile** - Use DevTools responsive mode
10. **Read inline comments** - Code has helpful comments

---

## 🎓 Learning Resources

### Recommended Reading Order:
1. This file (10 min)
2. Browse codebase (20 min)
3. COMPREHENSIVE_DOCUMENTATION.md (30 min)
4. ARCHITECTURE_DIAGRAMS.md (15 min)
5. Try building something! (∞)

### External Resources:
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## ✅ Checklist for Your First Task

- [ ] Dev server running
- [ ] MongoDB connected
- [ ] Can access homepage
- [ ] Can view catalog
- [ ] Understand project structure
- [ ] Know where components are
- [ ] Know how to import utilities
- [ ] Can create a test page
- [ ] Can make API call
- [ ] Can use shared components

---

**You're ready to code! Happy developing! 🚀**

*Questions? Check COMPREHENSIVE_DOCUMENTATION.md for detailed explanations.*

