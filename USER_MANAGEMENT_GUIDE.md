# User Management System Guide

## Overview

The User Management System provides administrative capabilities for viewing user accounts and managing admin roles in the AutoParts application. This system is designed exclusively for admin users and focuses on role management while providing comprehensive user insights and activity monitoring.

## Features

### 1. User Overview Dashboard

- **Statistics Cards**: Display total users, customers, admins, verified/unverified accounts, new users today, and active users in the last 7 days
- **Real-time Metrics**: Automatically updated statistics showing user distribution and activity
- **Visual Indicators**: Color-coded cards for different user metrics

### 2. Advanced Search and Filtering

- **Multi-field Search**: Search across user names, emails, and phone numbers
- **Role Filtering**: Filter by customer or admin roles
- **Status Filtering**: Filter by active/inactive status
- **Real-time Results**: Instant filtering as you type

### 3. Role Management

- **View User Details**: Comprehensive user profiles with activity history
- **Admin Role Control**: Promote users to admin or demote admins to customers
- **Self-Protection**: Admins cannot modify their own role to prevent lockouts

### 4. Activity Monitoring

- **Order History**: View user's recent orders with totals and status
- **Quote History**: Track user's quote requests and their status
- **Partner Applications**: Monitor partner application status
- **Login Tracking**: Track last login times and activity patterns

### 5. Security Features

- **Role-based Access**: Only admin users can access user management
- **Self-protection**: Admins cannot modify their own role to prevent lockouts
- **Audit Trail**: Track all role changes with timestamps
- **Data Validation**: Validation for role change operations

## User Interface Components

### Main Dashboard

- **Navigation**: Breadcrumb navigation for easy orientation
- **Statistics Overview**: 7 key metrics displayed in cards
- **Quick Actions**: Direct access to user management functions

### User Table

- **Sortable Columns**: Click column headers to sort data
- **Pagination**: Navigate through large user lists
- **Action Buttons**: View, edit, and delete actions for each user
- **Status Badges**: Visual indicators for user status and role

### User Details Modal

- **Basic Information**: Name, email, phone, role display
- **Activity Statistics**: Order count, quote count, partner status
- **Recent Activity**: Last 5 orders and quotes
- **Admin Notes**: Internal notes section

### User Edit Modal

- **Form Validation**: Real-time validation for all fields
- **Role Management**: Change user roles with appropriate permissions
- **Status Control**: Toggle email verification and account status
- **Notes Management**: Add or update admin notes

## API Endpoints

### GET /api/admin/users

Retrieve paginated list of users with filtering and search capabilities.

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20)
- `search`: Search term for name/email/phone
- `role`: Filter by role (all, customer, admin)
- `status`: Filter by status (all, active, inactive)
- `sortBy`: Sort field (default: createdAt)
- `sortOrder`: Sort direction (asc, desc)

**Response:**

```json
{
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  },
  "statistics": {
    "total": 150,
    "customers": 142,
    "admins": 8,
    "verified": 135,
    "unverified": 15,
    "newToday": 3,
    "activeLastWeek": 89
  }
}
```

### GET /api/admin/users/[id]

Get detailed information about a specific user.

**Response:**

```json
{
  "user": {...},
  "statistics": {
    "orderCount": 12,
    "quoteCount": 5,
    "hasPartnerApplication": false,
    "partnerStatus": null
  },
  "recentOrders": [...],
  "recentQuotes": [...]
}
```

### PATCH /api/admin/users/[id]

Update user role only.

**Request Body:**

```json
{
  "role": "admin"
}
```

**Restrictions:**

- Cannot modify own role
- Only role field can be modified
- Must be either "admin" or "customer"

## Security Considerations

### Access Control

- **Admin-only Access**: All user management functions require admin role
- **Route Protection**: API routes use `withAdminAuth` middleware
- **UI Protection**: Frontend checks user role before rendering

### Data Protection

- **Password Exclusion**: User passwords are never returned in API responses
- **Sensitive Data**: Admin notes and internal fields are protected
- **Audit Logging**: All user modifications are logged with timestamps

### Self-Protection

- **Account Safety**: Admins cannot modify their own critical settings
- **Role Protection**: Prevents accidental role changes that could lock out access
- **Deletion Protection**: Prevents self-deletion scenarios

## Usage Instructions

### Accessing User Management

1. Log in as an admin user
2. Navigate to Admin Dashboard
3. Click "Manage Users" button
4. Access the comprehensive user management interface

### Searching and Filtering Users

1. Use the search bar to find users by name, email, or phone
2. Apply role filters to show only customers or admins
3. Use status filters to show active or inactive accounts
4. Results update in real-time as you type or change filters

### Viewing User Details

1. Click the eye icon next to any user in the table
2. View comprehensive user information including:
   - Basic profile information
   - Activity statistics
   - Recent orders and quotes
   - Admin notes

### Managing User Roles

1. Click the role management button next to any user (except yourself)
2. For customers: Click the blue settings icon to promote to admin
3. For admins: Click the red user icon to demote to customer
4. Confirm the role change in the dialog
5. The change is applied immediately

### Role Management Rules

- **Self-Protection**: You cannot modify your own role
- **Admin Promotion**: Customers can be promoted to admin status
- **Admin Demotion**: Admins can be demoted to customer status
- **Immediate Effect**: Role changes take effect immediately

## Best Practices

### User Management

1. **Regular Audits**: Periodically review user accounts and admin assignments
2. **Role Management**: Carefully manage admin role assignments
3. **Admin Oversight**: Monitor admin user activity and access
4. **Role Reviews**: Regularly review who has admin access

### Security Practices

1. **Principle of Least Privilege**: Only assign admin roles when necessary
2. **Regular Reviews**: Periodically audit admin user accounts
3. **Role Protection**: Ensure admins cannot accidentally remove their own access
4. **Monitoring**: Watch for suspicious activity patterns

### Data Management

1. **Backup Considerations**: User data should be included in regular backups
2. **Privacy Compliance**: Ensure user data handling complies with privacy laws
3. **Data Retention**: Establish policies for user data retention
4. **Access Logs**: Monitor admin access to user management functions

## Troubleshooting

### Common Issues

1. **Access Denied**: Ensure you're logged in as an admin user
2. **Search Not Working**: Check for typos in search terms
3. **Role Change Blocked**: Cannot modify your own role
4. **Button Disabled**: Self-protection prevents role modification

### Error Messages

- "Access Denied": User doesn't have admin privileges
- "User not found": Invalid user ID or user was deleted
- "Cannot modify your own role": Attempting to change own admin status
- "Invalid role": Role must be either "admin" or "customer"
- "Role update failed": Server error during role change

## Integration Points

### Authentication System

- Integrates with existing JWT authentication
- Uses role-based access control
- Maintains session security

### Order Management

- Links to user order history
- Prevents deletion of users with orders
- Provides order statistics

### Quote System

- Connects to quote management
- Shows user quote history
- Tracks quote activity

### Partner System

- Monitors partner applications
- Links partner status to user accounts
- Provides partner application insights

## Future Enhancements

### Planned Features

1. **Bulk Operations**: Select and modify multiple users at once
2. **Export Functionality**: Export user data to CSV/Excel
3. **Advanced Analytics**: User behavior analytics and reporting
4. **Communication Tools**: Direct messaging to users
5. **Activity Logs**: Detailed audit logs for all user actions

### Potential Improvements

1. **User Segmentation**: Create user groups and segments
2. **Automated Actions**: Set up automated user management rules
3. **Integration APIs**: Connect with external user management systems
4. **Mobile Optimization**: Improve mobile user management experience
5. **Real-time Updates**: Live updates for user status changes

This user management system provides a comprehensive solution for administrative oversight of user accounts while maintaining security and data integrity throughout the application.
