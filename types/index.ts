// Shared type definitions for the application

import { ObjectId } from 'mongodb';
import type { CarMake, PartCategory, PartCondition, UserRole, OrderStatus, QuoteStatus } from '@/lib/constants';

// ==================== User Types ====================

export interface User {
  _id?: ObjectId | string;
  email: string;
  name: string;
  password?: string; // Not included in responses
  role: UserRole;
  phoneNumber?: string;
  address?: Address;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country: string;
}

// ==================== Part Types ====================

export interface Part {
  _id?: ObjectId | string;
  partNumber: string;
  name: string;
  description: string;
  category: PartCategory;
  subcategory?: string;
  brand: string;
  manufacturer?: string;
  compatibility: PartCompatibility;
  price: number;
  costPrice: number;
  currency: string;
  stock: number;
  lowStockThreshold: number;
  sku: string;
  location?: string;
  images: PartImage[];
  specifications: PartSpecifications;
  tags: string[];
  searchKeywords: string[];
  isActive: boolean;
  isFeatured: boolean;
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: ObjectId | string;
  lastModifiedBy?: ObjectId | string;
}

export interface PartImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  alt?: string;
}

export interface PartCompatibility {
  make?: CarMake[];
  model?: string[];
  year?: number[];
  generation?: string;
  engineType?: string[];
  variant?: string[];
}

export interface PartSpecifications {
  condition?: PartCondition;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'inch';
  };
  material?: string;
  color?: string;
  warranty?: string;
  oem?: boolean;
  position?: 'Left' | 'Right' | 'Front' | 'Rear' | 'Center';
  grade?: 'A' | 'B' | 'C';
  [key: string]: any;
}

// ==================== Cart Types ====================

export interface CartItem {
  id: string;
  partNumber: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  stock: number;
}

// ==================== Order Types ====================

export interface Order {
  _id?: ObjectId | string;
  orderNumber: string;
  userId: ObjectId | string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  paymentIntentId?: string;
  shippingAddress: Address;
  billingAddress?: Address;
  trackingNumber?: string;
  notes?: string;
  statusHistory: OrderStatusHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  partId: ObjectId | string;
  partNumber: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  image?: string;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
  updatedBy?: ObjectId | string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

// ==================== Quote Types ====================

export interface Quote {
  _id?: ObjectId | string;
  quoteNumber: string;
  userId?: ObjectId | string;
  customerInfo: CustomerInfo;
  vehicle?: VehicleInfo;
  requestedParts: QuoteItem[];
  status: QuoteStatus;
  notes?: string;
  attachments?: string[];
  quotedParts?: QuotedPart[];
  subtotal?: number;
  tax?: number;
  total?: number;
  validUntil?: Date;
  respondedAt?: Date;
  respondedBy?: ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteItem {
  description: string;
  quantity: number;
  images?: string[];
}

export interface QuotedPart {
  partId?: ObjectId | string;
  partNumber?: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  availability: 'in_stock' | 'order' | 'unavailable';
  leadTime?: string;
}

export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  vin?: string;
  engineType?: string;
}

// ==================== Partner Types ====================

export interface Partner {
  _id?: ObjectId | string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: Address;
  businessType: string;
  registrationNumber?: string;
  taxId?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  applicationDate: Date;
  approvedDate?: Date;
  approvedBy?: ObjectId | string;
  discount?: number;
  paymentTerms?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== API Response Types ====================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface PartsResponse {
  parts: Part[];
  total: number;
  pagination?: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  filters?: {
    categories: string[];
    brands: string[];
    makes: string[];
  };
}

// ==================== Search/Filter Types ====================

export interface SearchFilters {
  search?: string;
  category?: string;
  brand?: string;
  make?: string;
  model?: string;
  year?: string;
  minPrice?: string;
  maxPrice?: string;
  condition?: string;
  inStock?: boolean;
}

export interface SortOptions {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// ==================== Dashboard Stats Types ====================

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalParts: number;
  recentOrders: Order[];
  lowStockParts: Part[];
  topSellingParts: Part[];
  revenueByMonth: RevenueData[];
}

export interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
}

export interface UserDashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalSpent: number;
  recentOrders: Order[];
  favoriteCategories: string[];
}

// ==================== Form Data Types ====================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
}

export interface PartFormData extends Omit<Part, '_id' | 'createdAt' | 'updatedAt' | 'averageRating' | 'reviewCount'> {}

export interface ProfileUpdateData {
  name?: string;
  phoneNumber?: string;
  address?: Address;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ==================== Notification Types ====================

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// ==================== File Upload Types ====================

export interface FileUploadResponse {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

// ==================== Body Parts Types ====================

export interface BodyPart extends Part {
  category: 'Body Parts';
  specifications: PartSpecifications & {
    position: 'Left' | 'Right' | 'Front' | 'Rear' | 'Center';
    partType: 'Headlamp' | 'Taillamp' | 'Side Mirror' | 'Bumper' | 'Fender' | 'Door' | 'Grille';
    grade?: 'A' | 'B';
    isSkinned?: boolean;
  };
}

export interface BodyPartsInventory {
  vehicleName: string;
  years: string;
  parts: BodyPartItem[];
}

export interface BodyPartItem {
  type: string;
  quantity: number;
  positions: string[];
}

