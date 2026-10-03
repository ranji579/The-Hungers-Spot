import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const identifier = (body.email || body.username || '').trim().toLowerCase();
    const password = body.password;
    const requiredRole = body.requiredRole as 'ADMIN' | 'OWNER' | undefined;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 1. Try Supabase Auth first (for users created in Supabase Dashboard -> Authentication -> Users)
    if (identifier.includes('@')) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: identifier,
          password: password,
        });

        if (!authError && authData?.user) {
          const userEmail = authData.user.email?.toLowerCase() || identifier;
          
          // Determine role from metadata or email name
          let role: 'ADMIN' | 'OWNER';
          const metaRole = (authData.user.user_metadata?.role as string)?.toUpperCase();

          if (metaRole === 'ADMIN' || metaRole === 'OWNER') {
            role = metaRole;
          } else if (userEmail.includes('admin')) {
            role = 'ADMIN';
          } else if (userEmail.includes('owner')) {
            role = 'OWNER';
          } else {
            role = requiredRole || 'OWNER';
          }

          // Validate role constraint if specified
          if (requiredRole && role !== requiredRole) {
            return NextResponse.json(
              { success: false, message: `Access denied. This account does not have ${requiredRole.toLowerCase()} privileges.` },
              { status: 403 }
            );
          }

          const usernamePart = userEmail.split('@')[0];
          const displayName = authData.user.user_metadata?.display_name || (role === 'ADMIN' ? 'Super Admin' : 'Restaurant Owner');

          return NextResponse.json({
            success: true,
            user: {
              id: authData.user.id,
              username: usernamePart,
              email: userEmail,
              role,
              displayName,
            },
          });
        }
      } catch (sbErr) {
        console.warn('[SUPABASE AUTH ATTEMPT]', sbErr);
      }
    }

    // 2. Fallback to Prisma database table (public.users)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier }
        ]
      },
    });

    if (user) {
      // Check role if requiredRole is specified
      if (requiredRole && user.role !== requiredRole) {
        return NextResponse.json(
          { success: false, message: `Access denied. This account does not have ${requiredRole.toLowerCase()} privileges.` },
          { status: 403 }
        );
      }

      // Verify password hash
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (isPasswordValid) {
        return NextResponse.json({
          success: true,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            displayName: user.displayName,
          },
        });
      }
    }

    return NextResponse.json(
      { success: false, message: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('[AUTH LOGIN ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
