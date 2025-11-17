'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const checkUser = async () => {
      try {
        // First, check if there's an active session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (sessionError) {
          console.error('[Dashboard] Session check error:', sessionError);
          setError('Unable to retrieve session');
          setLoading(false);
          router.push('/');
          return;
        }

        if (!session) {
          console.log('[Dashboard] No session found, redirecting to login');
          setLoading(false);
          router.push('/');
          return;
        }

        console.log('[Dashboard] Session found for user:', session.user?.email);
        setUser(session.user);
        setLoading(false);
      } catch (err) {
        if (isMounted) {
          console.error('[Dashboard] Unexpected error:', err);
          setError('An unexpected error occurred');
          setLoading(false);
          router.push('/');
        }
      }
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        
        console.log('[Dashboard] Auth state changed:', event, session?.user?.email);
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
          router.push('/');
        }
      }
    );

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (err) {
      console.error('[Dashboard] Sign out error:', err);
      setError('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">加载中...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-red-600">未授权</p>
          <p className="text-gray-600 mt-2">正在重定向到登录页面...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">仪表板</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {user && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">登录的用户邮箱：</p>
            <p className="text-lg font-semibold text-gray-800">{user.email}</p>
            <p className="text-xs text-gray-500 mt-2">用户 ID: {user.id}</p>
          </div>
        )}

        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-800">✓ 您已成功登录！</p>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
        >
          退出登录
        </button>
      </div>
    </div>
  );
}
