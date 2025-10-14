# Implementation Guide

## Quick Start

### Step 1: Install Dependencies (if needed)
```bash
npm install
```

### Step 2: Seed Car Body Parts
```bash
npm run seed:body-parts
```

This will add ~50+ body parts for:
- Toyota Vitz/Yaris (2008-2019)
- Suzuki Swift (2011-2020)
- Toyota Aqua (2012-2019)
- Nissan Note E12 (2013-2020)
- Honda Fit GK (2014-2020)

### Step 3: Activate Refactored Pages

#### Option 1: Replace Existing Files (Recommended)
```bash
# Backup originals
cp app/page.tsx app/page.backup.tsx
cp app/catalog/page.tsx app/catalog/page.backup.tsx

# Use new versions
cp app/page-refactored.tsx app/page.tsx
cp app/catalog/page-optimized.tsx app/catalog/page.tsx
```

#### Option 2: Update API Client Import
In existing files, update:
```typescript
// Change this:
import { apiClient } from '@/lib/api-client';

// To this:
import { apiClient } from '@/lib/api-client-optimized';
```

### Step 4: Run Development Server
```bash
npm run dev
```

### Step 5: Test Features
- [ ] Visit homepage (http://localhost:3000)
- [ ] Test search functionality
- [ ] Browse catalog with filters
- [ ] Test cart functionality
- [ ] Check mobile responsiveness
- [ ] Test body parts category

## Key Features Added

### 1. Performance Optimizations
- **Request Caching**: API responses cached for 5 minutes
- **Request Deduplication**: Prevents duplicate simultaneous requests
- **Component Memoization**: React.memo on all major components
- **Code Splitting**: Dynamic imports for heavy components
- **Debounced Search**: 500ms delay for search inputs

### 2. Reusable Components

#### Shared Components
```typescript
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { StockBadge } from '@/components/shared/StockBadge';
import { SearchBar } from '@/components/shared/SearchBar';
import { Pagination } from '@/components/shared/Pagination';
```

#### Form Components
```typescript
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { FormSelect } from '@/components/forms/FormSelect';
import { FormCheckbox } from '@/components/forms/FormCheckbox';
```

### 3. Custom Hooks
```typescript
import { useDebounce } from '@/hooks/useDebounce';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useMediaQuery, useIsMobile } from '@/hooks/useMediaQuery';
import { usePagination } from '@/hooks/usePagination';
import { useAsync } from '@/hooks/useAsync';
```

### 4. Utilities
```typescript
import { formatPrice, formatDate, formatPhoneNumber } from '@/lib/utils/formatters';
import { isValidEmail, isValidPhoneNumber, validatePassword } from '@/lib/utils/validators';
import { CAR_MAKES, PART_CATEGORIES, CONTACT_INFO } from '@/lib/constants';
```

## Example Usage

### Example 1: Using Form Components
```typescript
'use client';

import { useState } from 'react';
import { FormInput } from '@/components/forms/FormInput';
import { FormSelect } from '@/components/forms/FormSelect';
import { Button } from '@/components/ui/button';
import { CAR_MAKES } from '@/lib/constants';

export function PartForm() {
  const [formData, setFormData] = useState({ name: '', make: '' });
  const [errors, setErrors] = useState({});

  return (
    <form className="space-y-4">
      <FormInput
        label="Part Name"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        required
      />
      
      <FormSelect
        label="Vehicle Make"
        options={CAR_MAKES.map(make => ({ value: make, label: make }))}
        value={formData.make}
        onValueChange={(value) => setFormData({ ...formData, make: value })}
        error={errors.make}
        required
      />
      
      <Button type="submit">Save Part</Button>
    </form>
  );
}
```

### Example 2: Using Custom Hooks
```typescript
'use client';

import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { SearchBar } from '@/components/shared/SearchBar';

export function SearchComponent() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const isMobile = useIsMobile();

  // debouncedQuery updates 500ms after user stops typing
  // Use it for API calls
  
  return (
    <div>
      <SearchBar 
        onSearch={setQuery}
        placeholder={isMobile ? 'Search...' : 'Search parts...'}
      />
      <p>Searching for: {debouncedQuery}</p>
    </div>
  );
}
```

### Example 3: Using Formatters
```typescript
import { formatPrice, formatDate, formatCompatibility } from '@/lib/utils/formatters';

// Price formatting
const price = formatPrice(2500, 'MUR'); // "Rs 2,500"

// Date formatting
const date = formatDate(new Date(), 'short'); // "Jan 15, 2024"

// Compatibility formatting
const compat = formatCompatibility({
  make: ['Toyota'],
  model: ['Vitz', 'Yaris'],
  year: [2008, 2009, 2010]
}); // "Toyota Vitz, Yaris 2008-2010"
```

### Example 4: Error Boundary
```typescript
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export default function MyPage() {
  return (
    <ErrorBoundary>
      <YourComponents />
    </ErrorBoundary>
  );
}
```

### Example 5: Optimized API Client
```typescript
import { apiClient } from '@/lib/api-client-optimized';

async function fetchParts() {
  // First call hits the API
  const data1 = await apiClient.getParts({ category: 'Engine' });
  
  // Second call within 5 minutes returns cached data
  const data2 = await apiClient.getParts({ category: 'Engine' });
  
  // Force skip cache
  const fresh = await apiClient.getParts({ category: 'Engine', skipCache: true });
}

// Clear cache after mutations
async function updatePart(id, data) {
  await apiClient.updatePart(id, data);
  // Cache is automatically cleared
}
```

## Responsive Design Classes

All components use Tailwind's responsive classes:
```typescript
// Mobile-first approach
className="
  text-sm          // Base (mobile)
  md:text-base     // Medium screens (768px+)
  lg:text-lg       // Large screens (1024px+)
  
  p-4              // Base padding
  md:p-6           // Medium screen padding
  lg:p-8           // Large screen padding
  
  grid-cols-1      // Single column on mobile
  sm:grid-cols-2   // 2 columns on small screens
  md:grid-cols-3   // 3 columns on medium
  lg:grid-cols-4   // 4 columns on large
"
```

## Constants Reference

### Available Constants
```typescript
import {
  CAR_MAKES,              // ['BMW', 'Audi', 'Toyota', ...]
  PART_CATEGORIES,        // ['Engine', 'Brake', 'Body Parts', ...]
  PART_CONDITIONS,        // ['New', 'OEM', 'A Grade', ...]
  BODY_PART_TYPES,        // ['Headlamp', 'Taillamp', ...]
  BODY_PART_POSITIONS,    // ['Left', 'Right', 'Front', ...]
  CONTACT_INFO,           // { PHONE, WHATSAPP, EMAIL, ... }
  CURRENCY,               // { CODE: 'MUR', SYMBOL: 'Rs', ... }
  VALIDATION,             // { EMAIL_REGEX, PHONE_REGEX, ... }
  API_ENDPOINTS,          // { AUTH, PARTS, ORDERS, ... }
  SORT_OPTIONS,           // [{ value: 'name', label: 'Name' }, ...]
} from '@/lib/constants';
```

## Testing Your Implementation

### 1. Test Search Performance
- Open catalog page
- Type in search box rapidly
- Observe only one API call after you stop typing (debounced)

### 2. Test Caching
- Open browser DevTools > Network tab
- Load parts list
- Reload page
- Observe no new API call (cached)

### 3. Test Responsive Design
- Open DevTools
- Toggle device toolbar
- Test various screen sizes:
  - Mobile: 375px
  - Tablet: 768px
  - Desktop: 1280px

### 4. Test Body Parts
- Go to catalog
- Filter by category "Body Parts"
- Should see Toyota, Suzuki, Nissan, Honda body parts
- Check for proper positioning (Left/Right/Front/Rear)

### 5. Test Error Handling
- Disconnect internet
- Try to load data
- Should see error message

## Troubleshooting

### Issue: Components not rendering
**Solution**: Check imports - use correct paths
```typescript
// Correct
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

// Wrong
import LoadingSpinner from '@/components/shared/LoadingSpinner';
```

### Issue: API not caching
**Solution**: Make sure you're using the optimized client
```typescript
import { apiClient } from '@/lib/api-client-optimized';
```

### Issue: Body parts not showing
**Solution**: Run the seed script
```bash
npm run seed:body-parts
```

### Issue: TypeScript errors
**Solution**: Ensure types are imported
```typescript
import type { Part, SearchFilters } from '@/types';
```

## File Structure Quick Reference

```
Key Files to Know:
├── lib/constants/index.ts           → All constants
├── lib/utils/formatters.ts          → Formatting utilities
├── lib/utils/validators.ts          → Validation utilities
├── lib/api-client-optimized.ts      → Enhanced API client
├── types/index.ts                   → TypeScript types
├── components/shared/               → Reusable UI components
├── components/forms/                → Form components
├── hooks/                           → Custom React hooks
├── app/page-refactored.tsx          → New homepage
└── app/catalog/page-optimized.tsx   → New catalog
```

## Performance Monitoring

To measure improvements:

### Before Refactoring
```bash
# Run Lighthouse audit on old pages
npm run build
npm run start
# Open Chrome DevTools > Lighthouse > Run audit
```

### After Refactoring
```bash
# Activate refactored pages
# Run Lighthouse audit again
# Compare scores
```

Expected improvements:
- Performance: +15-30 points
- First Contentful Paint: -30%
- Time to Interactive: -25%
- Total Bundle Size: -20%

## Support

For questions or issues:
1. Check `REFACTORING_SUMMARY.md` for detailed documentation
2. Review code comments in components
3. Check TypeScript types for component props
4. Test in development mode first

## Next Steps

1. ✅ Complete - All refactoring done
2. 🔄 Activate refactored pages
3. 🧪 Test all functionality
4. 📊 Monitor performance
5. 🚀 Deploy to production

Good luck soldier! 🎖️

