import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const next = searchParams.get('next') || '/dashboard';

  console.log('[auth/callback] Full URL:', request.url);
  console.log('[auth/callback] Search params:', Object.fromEntries(searchParams));
  console.log('[auth/callback] Received OAuth callback with code:', !!code);

  if (error) {
    console.warn('[auth/callback] OAuth error from provider:', error, errorDescription);
    const errorMsg = errorDescription || error;
    return NextResponse.redirect(new URL(`/auth/auth-code-error?error=${encodeURIComponent(errorMsg)}`, request.url));
  }

  if (!code) {
    console.warn('[auth/callback] No authorization code provided');
    return NextResponse.redirect(new URL('/auth/auth-code-error?error=no_code&message=GitHub未返回授权码，请检查回调URL配置', request.url));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[auth/callback] Missing Supabase environment variables');
    return NextResponse.redirect(new URL('/auth/auth-code-error?error=config', request.url));
  }

  try {
    // Create a Supabase client for exchanging the code
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    
    // Exchange the authorization code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[auth/callback] Session exchange error:', error.message);
      return NextResponse.redirect(new URL(`/auth/auth-code-error?error=${encodeURIComponent(error.message)}`, request.url));
    }

    if (!data.session) {
      console.error('[auth/callback] No session returned from exchange');
      return NextResponse.redirect(new URL('/auth/auth-code-error?error=no_session', request.url));
    }

    // Successfully exchanged code for session
    console.log('[auth/callback] Successfully authenticated user:', data.user?.email);
    console.log('[auth/callback] Session tokens obtained, user ID:', data.user?.id);
    
    // Create response that redirects to dashboard
    // The session cookies will be set by Supabase automatically
    const redirectUrl = new URL(next, request.url);
    const response = NextResponse.redirect(redirectUrl);

    // Set cache headers to ensure fresh data
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (err) {
    console.error('[auth/callback] Unexpected error:', err);
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.redirect(new URL(`/auth/auth-code-error?error=${encodeURIComponent(errorMsg)}`, request.url));
  }
}
