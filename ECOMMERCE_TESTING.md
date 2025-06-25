# E-commerce Features Testing Guide

## 🛒 Shopping Experience Testing

### Prerequisites

1. Set up environment variables (see SETUP_GUIDE.md)
2. Start the development server: `npm run dev`
3. Ensure MongoDB is running

### 1. User Registration & Login

1. Navigate to `/register`
2. Create a new user account
3. Login with the new credentials
4. Verify authentication state in navigation

### 2. Parts Catalog Browsing

1. Navigate to `/catalog`
2. **Test Search:**
   - Use search bar with keywords like "brake", "oil", "BMW"
   - Verify real-time search functionality
3. **Test Filters:**
   - Click "Filters" button to expand filter panel
   - Select different vehicle makes (BMW, Audi, Mercedes-Benz)
   - Filter by categories (Engine, Brake, Suspension)
   - Filter by condition (New, OEM, Aftermarket)
   - Set price ranges
4. **Test View Modes:**
   - Toggle between Grid and List views
   - Verify layout changes appropriately
5. **Test Sorting:**
   - Sort by Name, Price, Vehicle Make, Category
   - Verify results reorder correctly

### 3. Shopping Cart Functionality

1. **Adding Items:**
   - Click "Add to Cart" on any part
   - Verify toast notification appears
   - Check cart icon shows item count badge
2. **Cart Management:**
   - Click cart icon to open cart drawer
   - Verify item details are correct
   - Test quantity controls (+/- buttons)
   - Test item removal (X button)
   - Verify total price updates correctly
3. **Cart Persistence:**
   - Add items to cart
   - Refresh page or navigate away
   - Return to verify cart items are preserved

### 4. Part Detail Pages

1. Click "View" on any part in catalog
2. **Verify Details:**
   - Part name, number, description
   - Price and stock status
   - Vehicle compatibility information
   - Technical specifications
3. **Test Image Gallery:**
   - Click thumbnail images to change main image
   - Verify image navigation works
4. **Test Add to Cart:**
   - Select quantity
   - Click "Add to Cart"
   - Verify item added to cart with correct quantity

### 5. Checkout Process

1. **Prerequisites:**
   - Add items to cart
   - Ensure you're logged in
2. **Navigate to Checkout:**
   - Click "Proceed to Checkout" in cart
   - Verify checkout page loads with step indicator
3. **Step 1 - Shipping Information:**
   - Fill in contact information (pre-filled from user profile)
   - Fill in shipping address
   - Select shipping method (Standard, Express, Same Day)
   - Click "Continue to Payment"
4. **Step 2 - Payment:**
   - Select payment method (Credit Card or Cash on Delivery)
   - For Credit Card: Fill in card details (use test numbers)
   - Check "Agree to Terms and Conditions"
   - Click "Pay" button
5. **Order Completion:**
   - Wait for processing simulation
   - Verify redirect to success page
   - Check order number generation
   - Verify cart is cleared

### 6. Order Success Experience

1. **After successful checkout:**
   - Verify success page displays order details
   - Check order number format (AMO-XXXXXXX)
   - Test "View My Orders" button (redirects to orders page)
   - Test "Continue Shopping" button

### 7. Order Management & History

1. **Customer Order History:**

   - Navigate to `/orders` or click "My Orders" from navigation
   - Verify order listing displays correctly
   - Check order details: number, date, total, status
   - Test search functionality by order number or part name
   - Filter orders by status (Processing, Shipped, Delivered, Cancelled)

2. **Order Detail Page:**

   - Click "View Details" on any order
   - Verify complete order information:
     - Order items with quantities and prices
     - Shipping address and contact information
     - Payment method and status
     - Order summary with tax and shipping breakdown
   - Test "Back to Orders" button
   - Test contact support functionality

3. **Order Status Tracking:**
   - Verify status badges display correctly
   - Check estimated delivery dates
   - Confirm order progression (Processing → Shipped → Delivered)

## 🔧 Admin Testing

### Admin Dashboard

1. **Create Admin User:**
   ```bash
   # Use test-api.js to create admin user
   node test-api.js
   ```
2. **Login as Admin:**
   - Login with admin credentials
   - Verify "Admin Panel" appears in user dropdown
3. **Admin Dashboard:**
   - Navigate to `/admin`
   - Verify statistics display (users, parts, orders, revenue)
   - Check role protection (non-admin users cannot access)

### Admin Parts Management

1. **Parts Management Interface:**

   - Navigate to `/admin/parts`
   - Verify parts listing with search and filters
   - Test category, brand, and stock filters
   - Check pagination functionality

2. **Create New Part:**

   - Click "Add Part" button
   - Fill in all required fields:
     - Basic info (part number, name, description)
     - Category and brand selection
     - Pricing (cost, selling, sale price)
     - Stock quantity
     - Specifications (condition, weight, warranty)
   - Submit form and verify part creation

3. **Edit Existing Part:**

   - Click "Edit" on any part in the list
   - Modify part information
   - Save changes and verify updates

4. **Delete Part:**
   - Click "Delete" on any part
   - Confirm deletion in alert dialog
   - Verify part is removed from list

### Admin Order Management

1. **View All Orders:**
   - Access admin order list (when implemented)
   - Verify admin can see orders from all users
   - Test order status updates
   - Check order filtering and search

## 📱 Responsive Design Testing

### Desktop (1920px+)

- [ ] Navigation shows all elements
- [ ] Catalog grid shows 4 columns
- [ ] Checkout form uses 2-column layout
- [ ] All buttons and interactions work

### Tablet (768px - 1024px)

- [ ] Navigation collapses appropriately
- [ ] Catalog grid shows 2-3 columns
- [ ] Forms remain usable
- [ ] Cart drawer functions properly

### Mobile (320px - 768px)

- [ ] Navigation shows hamburger menu
- [ ] Catalog switches to single column
- [ ] Forms stack vertically
- [ ] All touch interactions work

## 🧪 Edge Cases & Error Handling

### Cart Edge Cases

1. **Out of Stock Items:**
   - Try adding items where quantity exceeds stock
   - Verify error messages
2. **Empty Cart Checkout:**
   - Try accessing `/checkout` with empty cart
   - Verify redirect to catalog

### Authentication Edge Cases

1. **Unauthenticated Checkout:**
   - Log out and try to checkout
   - Verify login prompt appears
2. **Session Expiry:**
   - Wait for token expiry or manually clear tokens
   - Try performing authenticated actions

### Network Error Simulation

1. **Offline Testing:**
   - Disconnect internet during search
   - Verify graceful fallback to demo data
2. **API Errors:**
   - Stop backend server
   - Verify error handling and user feedback

## 🎨 User Experience Validation

### Visual Design

- [ ] Consistent color scheme (#D72638 brand color)
- [ ] Proper spacing and typography
- [ ] Loading states are smooth
- [ ] Hover effects work on interactive elements

### Performance

- [ ] Page loads quickly
- [ ] Images load efficiently
- [ ] Smooth transitions between states
- [ ] No console errors in browser

### Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Color contrast meets standards
- [ ] Focus indicators are visible

## 🔧 API Testing with Postman/cURL

### Order Management APIs

#### Create Order

```bash
POST http://localhost:3000/api/orders
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "items": [
    {
      "partId": "PART_ID_HERE",
      "quantity": 2
    }
  ],
  "shipping": {
    "method": "Standard Delivery",
    "cost": 20,
    "estimatedDays": 5,
    "address": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+230 5712 3456",
      "address": "123 Royal Road",
      "city": "Port Louis",
      "country": "Mauritius"
    }
  },
  "payment": {
    "method": "cod"
  },
  "taxRate": 0.15
}
```

#### Get Orders List

```bash
GET http://localhost:3000/api/orders?page=1&limit=10&status=processing
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Order Details

```bash
GET http://localhost:3000/api/orders/ORDER_ID_HERE
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Update Order Status (Admin Only)

```bash
PATCH http://localhost:3000/api/orders/ORDER_ID_HERE
Content-Type: application/json
Authorization: Bearer ADMIN_JWT_TOKEN

{
  "status": "shipped",
  "tracking": "TRK123456789",
  "notes": "Package dispatched via DHL"
}
```

### Parts Management APIs

#### Create Part (Admin Only)

```bash
POST http://localhost:3000/api/parts
Content-Type: application/json
Authorization: Bearer ADMIN_JWT_TOKEN

{
  "partNumber": "BRK002",
  "name": "Brake Disc Set",
  "description": "Premium brake discs for enhanced performance",
  "category": "Brakes",
  "brand": "Brembo",
  "price": 150.00,
  "costPrice": 75.00,
  "stock": 20,
  "sku": "BRK-BREMBO-002",
  "compatibility": {
    "make": ["BMW", "Audi"],
    "model": ["3 Series", "A4"],
    "year": [2015, 2016, 2017, 2018, 2019, 2020]
  },
  "specifications": {
    "condition": "new",
    "weight": 5.2,
    "warranty": "2 years"
  },
  "tags": ["brake", "disc", "performance"]
}
```

## 🐛 Common Issues & Solutions

### Issue: Cart not persisting

**Solution:** Check browser localStorage, ensure JavaScript is enabled

### Issue: Search not working

**Solution:** Verify MongoDB connection, check API endpoints

### Issue: Checkout hanging

**Solution:** Check form validation, ensure all required fields filled

### Issue: Images not loading

**Solution:** Verify placeholder images exist in `/public` folder

## 📊 Test Data Examples

### Valid Test Credit Cards (for testing)

- Visa: 4242 4242 4242 4242
- Mastercard: 5555 5555 5555 4444
- Amex: 3782 822463 10005
- Expiry: Any future date (MM/YY)
- CVV: Any 3-4 digits

### Sample Search Terms

- "brake pads BMW"
- "oil filter"
- "suspension"
- "headlight"
- "BRK001" (part number)

### Sample Parts for Testing

The demo data includes:

1. Brake Pads - Front Set (BMW, $89.99)
2. Oil Filter (Audi, $24.99)
3. Shock Absorber (Mercedes-Benz, $159.99)
4. Headlight Assembly (Toyota, $299.99)

## ✅ Testing Checklist

### Core Functionality

- [ ] User registration/login
- [ ] Parts catalog browsing
- [ ] Search and filtering
- [ ] Shopping cart operations
- [ ] Checkout process
- [ ] Order completion
- [ ] Admin panel access

### User Experience

- [ ] Responsive design
- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications
- [ ] Navigation consistency

### Data Integrity

- [ ] Cart persistence
- [ ] User authentication state
- [ ] Price calculations
- [ ] Stock tracking
- [ ] Form validation

### Performance

- [ ] Page load times
- [ ] Image optimization
- [ ] API response times
- [ ] Client-side caching

---

## 🚀 Next Phase Preview

After completing these tests, the next development phase will include:

1. **Stripe Payment Integration** - Real payment processing
2. **Order Management** - Order tracking and history
3. **Email Notifications** - Order confirmations and updates
4. **Admin Parts Management** - CRUD interface for inventory
5. **Advanced Features** - Wishlist, reviews, recommendations

Report any issues found during testing to continue improving the user experience!
