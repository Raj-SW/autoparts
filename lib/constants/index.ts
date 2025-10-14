// Constants for the application

// Car manufacturers
export const CAR_MAKES = [
  'BMW',
  'Audi',
  'Mercedes-Benz',
  'Toyota',
  'Suzuki',
  'Nissan',
  'Honda',
  'Ford',
  'Land Rover',
  'Volkswagen',
] as const;

export type CarMake = typeof CAR_MAKES[number];

// Part categories
export const PART_CATEGORIES = [
  'Engine',
  'Brake',
  'Suspension',
  'Electrical',
  'Body',
  'Body Parts', // New category for body parts
  'Transmission',
  'Cooling',
  'Exhaust',
  'Interior',
  'Lighting',
] as const;

export type PartCategory = typeof PART_CATEGORIES[number];

// Part conditions
export const PART_CONDITIONS = [
  'New',
  'OEM',
  'Aftermarket',
  'Refurbished',
  'A Grade',
  'B Grade',
] as const;

export type PartCondition = typeof PART_CONDITIONS[number];

// Body part types
export const BODY_PART_TYPES = [
  'Headlamp',
  'Taillamp',
  'Side Mirror',
  'Bumper',
  'Fender',
  'Door',
  'Grille',
  'Hood',
  'Trunk',
] as const;

export type BodyPartType = typeof BODY_PART_TYPES[number];

// Body part positions
export const BODY_PART_POSITIONS = [
  'Left',
  'Right',
  'Front',
  'Rear',
  'Center',
] as const;

export type BodyPartPosition = typeof BODY_PART_POSITIONS[number];

// User roles
export const USER_ROLES = ['admin', 'user', 'partner'] as const;
export type UserRole = typeof USER_ROLES[number];

// Order statuses
export const ORDER_STATUSES = [
  'pending',
  'processing',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
] as const;

export type OrderStatus = typeof ORDER_STATUSES[number];

// Quote statuses
export const QUOTE_STATUSES = [
  'pending',
  'reviewed',
  'approved',
  'rejected',
  'expired',
] as const;

export type QuoteStatus = typeof QUOTE_STATUSES[number];

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Currency
export const CURRENCY = {
  CODE: 'MUR',
  SYMBOL: 'Rs',
  USD_TO_MUR_RATE: 43.5, // Approximate exchange rate
} as const;

// Contact information
export const CONTACT_INFO = {
  PHONE: '+23057123456',
  WHATSAPP: '23057123456',
  EMAIL: 'info@amodistribution.mu',
  ADDRESS: 'Port Louis, Mauritius',
} as const;

// Thresholds
export const THRESHOLDS = {
  LOW_STOCK: 10,
  FREE_DELIVERY_AMOUNT: 5000, // in MUR
  MIN_ORDER_AMOUNT: 100,
} as const;

// Time constants
export const TIME = {
  QUOTE_RESPONSE_TIME_HOURS: 1,
  TOKEN_EXPIRY_MINUTES: 15,
  REFRESH_TOKEN_EXPIRY_DAYS: 7,
  SESSION_TIMEOUT_MINUTES: 30,
} as const;

// Validation constants
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  PHONE_REGEX: /^(\+230|230)?\d{8}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
    REFRESH: '/api/auth/refresh',
  },
  PARTS: {
    BASE: '/api/parts',
    BY_ID: (id: string) => `/api/parts/${id}`,
  },
  ORDERS: {
    BASE: '/api/orders',
    BY_ID: (id: string) => `/api/orders/${id}`,
    TRACK: (orderNumber: string) => `/api/orders/track/${orderNumber}`,
  },
  QUOTES: {
    BASE: '/api/quotes',
    BY_ID: (id: string) => `/api/quotes/${id}`,
    PDF: (id: string) => `/api/quotes/${id}/pdf`,
  },
  ADMIN: {
    DASHBOARD: '/api/admin/dashboard',
    USERS: '/api/admin/users',
  },
} as const;

// Sort options
export const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: 'brand', label: 'Brand' },
  { value: 'category', label: 'Category' },
] as const;

// Car body parts inventory data
export const CAR_BODY_PARTS_INVENTORY = {
  'Toyota Vitz/Yaris': {
    years: '2008-2019',
    parts: [
      { type: 'Headlamp', quantity: 10, positions: ['Left: 5', 'Right: 5'] },
      { type: 'Taillamp', quantity: 8, positions: ['Left: 4', 'Right: 4'] },
      { type: 'Side Mirror', quantity: 8, positions: ['Left: 4', 'Right: 4'] },
      { type: 'Bumper', quantity: 3, positions: ['Front: 2', 'Rear: 1'] },
      { type: 'Fender', quantity: 3, positions: ['Left: 1', 'Right: 2'] },
      { type: 'Door', quantity: 1, positions: ['Any (skinned, A/B grade only)'] },
      { type: 'Grille', quantity: 3, positions: ['Front'] },
    ],
  },
  'Suzuki Swift': {
    years: '2011-2020',
    parts: [
      { type: 'Headlamp', quantity: 10, positions: ['Left: 5', 'Right: 5'] },
      { type: 'Taillamp', quantity: 8, positions: ['Left: 4', 'Right: 4'] },
      { type: 'Side Mirror', quantity: 8, positions: ['Left: 4', 'Right: 4'] },
      { type: 'Bumper', quantity: 3, positions: ['Front: 2', 'Rear: 1'] },
      { type: 'Fender', quantity: 3, positions: ['Left: 1', 'Right: 2'] },
      { type: 'Grille', quantity: 3, positions: ['Front'] },
    ],
  },
  'Toyota Aqua': {
    years: '2012-2019',
    parts: [
      { type: 'Headlamp', quantity: 8, positions: ['Left: 4', 'Right: 4'] },
      { type: 'Taillamp', quantity: 6, positions: ['Left: 3', 'Right: 3'] },
      { type: 'Side Mirror', quantity: 6, positions: ['Left: 3', 'Right: 3'] },
      { type: 'Bumper', quantity: 3, positions: ['Front: 2', 'Rear: 1'] },
      { type: 'Fender', quantity: 2, positions: ['Left: 1', 'Right: 1'] },
      { type: 'Grille', quantity: 2, positions: ['Front'] },
    ],
  },
  'Nissan Note E12': {
    years: '2013-2020',
    parts: [
      { type: 'Headlamp', quantity: 6, positions: ['Left: 3', 'Right: 3'] },
      { type: 'Taillamp', quantity: 4, positions: ['Left: 2', 'Right: 2'] },
      { type: 'Side Mirror', quantity: 6, positions: ['Left: 3', 'Right: 3'] },
      { type: 'Bumper', quantity: 2, positions: ['Front: 1', 'Rear: 1'] },
      { type: 'Fender', quantity: 2, positions: ['Left: 1', 'Right: 1'] },
      { type: 'Grille', quantity: 1, positions: ['Front'] },
    ],
  },
  'Honda Fit GK': {
    years: '2014-2020',
    parts: [
      { type: 'Headlamp', quantity: 6, positions: ['Left: 3', 'Right: 3'] },
      { type: 'Taillamp', quantity: 4, positions: ['Left: 2', 'Right: 2'] },
      { type: 'Side Mirror', quantity: 4, positions: ['Left: 2', 'Right: 2'] },
      { type: 'Bumper', quantity: 1, positions: ['Front: 1'] },
      { type: 'Fender', quantity: 1, positions: ['Left: 1'] },
      { type: 'Grille', quantity: 1, positions: ['Front'] },
    ],
  },
} as const;

// Featured testimonials
export const TESTIMONIALS = [
  {
    name: 'Raj Patel',
    location: 'Port Louis',
    business: 'Patel Auto Garage',
    text: 'A.M.O saved my business! Got BMW parts in 2 hours when my customer was waiting. Their photo search feature is incredible - just snap and get instant quotes!',
    rating: 5,
    verified: true,
    savings: 'Rs 15,000',
  },
  {
    name: 'Sarah Lim',
    location: 'Quatre Bornes',
    business: 'Private Customer',
    text: 'My Hilux broke down Friday evening. A.M.O delivered Saturday morning! Their price comparison showed I saved 30% vs dealer. Incredible service!',
    rating: 5,
    verified: true,
    savings: 'Rs 8,500',
  },
  {
    name: 'Ahmed Hassan',
    location: 'Rose Hill',
    business: 'Hassan Motors',
    text: '3 years partnership with A.M.O. They understand my business needs. Wholesale prices help me stay competitive. True professionals!',
    rating: 5,
    verified: true,
    savings: 'Rs 45,000',
  },
  {
    name: 'Marie Dubois',
    location: 'Curepipe',
    business: 'Private Customer',
    text: 'WhatsApp ordering is revolutionary! Got Mercedes parts quote in 15 minutes, delivered same day. A.M.O is changing the game!',
    rating: 5,
    verified: true,
    savings: 'Rs 12,000',
  },
] as const;

