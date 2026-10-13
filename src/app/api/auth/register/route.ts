import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { findLocalUser, saveLocalUser, StoredUser } from '@/lib/authStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';
    const displayName = (body.displayName || '').trim();
    const role = (body.role || 'OWNER').toUpperCase() as 'ADMIN' | 'OWNER';

    // 1. Validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // 2. Check if email already registered locally
    const existingLocal = findLocalUser(email);
    if (existingLocal) {
      return NextResponse.json(
        {
          success: false,
          message: 'An account with this email already exists. Please sign in.',
          alreadyExists: true,
        },
        { status: 409 }
      );
    }

    // Generate unique username
    let baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
    if (!baseUsername) baseUsername = 'owner';
    let finalUsername = baseUsername;

    const existingUserByIdentifier = findLocalUser(finalUsername);
    if (existingUserByIdentifier) {
      finalUsername = `${baseUsername}_${Math.floor(100 + Math.random() * 900)}`;
    }

    const finalDisplayName = displayName || (role === 'OWNER' ? 'Restaurant Owner' : 'Administrator');
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 3. Try Supabase Auth signup (best effort)
    let supabaseUserId = userId;
    try {
      const { data: sbData, error: sbError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            display_name: finalDisplayName,
          },
        },
      });

      if (!sbError && sbData?.user?.id) {
        supabaseUserId = sbData.user.id;
      } else if (sbError && sbError.message?.toLowerCase().includes('already registered')) {
        return NextResponse.json(
          {
            success: false,
            message: 'This email is already registered in Supabase. Please sign in.',
            alreadyExists: true,
          },
          { status: 409 }
        );
      }
    } catch (sbErr) {
      console.warn('[SUPABASE SIGNUP]', sbErr);
    }

    // 4. Try Prisma database create (best effort)
    if (prisma) {
      try {
        await prisma.user.create({
          data: {
            id: supabaseUserId,
            username: finalUsername,
            email,
            passwordHash,
            role,
            displayName: finalDisplayName,
          },
        });
      } catch (prismaErr) {
        console.warn('[PRISMA SAVE FALLBACK]', prismaErr);
      }
    }

    // 5. Save locally for persistent and offline-resilient access
    const storedUser: StoredUser = {
      id: supabaseUserId,
      username: finalUsername,
      email,
      passwordHash,
      role,
      displayName: finalDisplayName,
      createdAt: new Date().toISOString(),
    };
    saveLocalUser(storedUser);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: storedUser.id,
        username: storedUser.username,
        email: storedUser.email,
        role: storedUser.role,
        displayName: storedUser.displayName,
      },
    });
  } catch (error) {
    console.error('[AUTH REGISTER ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Server error during registration. Please try again.' },
      { status: 500 }
    );
  }
}
