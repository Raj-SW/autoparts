import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { getDatabase } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

export interface AuthUser {
  userId: string;
  email: string;
  role: 'admin' | 'user';
}

export async function authenticate(
  request: NextRequest,
  requiredRole?: 'admin' | 'user'
): Promise<{ user?: AuthUser; error?: NextResponse }> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        error: NextResponse.json(
          { error: 'Authorization token required' },
          { status: 401 }
        )
      };
    }

    const token = authHeader.substring(7);
    
    try {
      // Verify the token
      const payload = verifyAccessToken(token);
      
      // Check if user still exists and is active
      const db = await getDatabase();
      const user = await db.collection('users').findOne({
        _id: new ObjectId(payload.userId),
        isActive: true
      });

      if (!user) {
        return {
          error: NextResponse.json(
            { error: 'User not found or inactive' },
            { status: 401 }
          )
        };
      }

      // Check role if required
      if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
        return {
          error: NextResponse.json(
            { error: 'Insufficient permissions' },
            { status: 403 }
          )
        };
      }

      return {
        user: {
          userId: payload.userId,
          email: payload.email,
          role: payload.role
        }
      };
    } catch (error) {
      return {
        error: NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        )
      };
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      error: NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      )
    };
  }
}

// Helper function to create authenticated API route handler
export function withAuth(
  handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>,
  requiredRole?: 'admin' | 'user'
) {
  return async (request: NextRequest) => {
    const { user, error } = await authenticate(request, requiredRole);
    
    if (error) {
      return error;
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return handler(request, user);
  };
}

// Admin-only route wrapper
export function withAdminAuth(
  handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>
) {
  return withAuth(handler, 'admin');
} 