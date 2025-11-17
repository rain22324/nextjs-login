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

    const initializeSession = async () => {
      try {
        console.log('[Dashboard] 初始化会话检查...');

        // 方法1: 使用 getSession() 检查是否有活跃会话
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (sessionError) {
          console.error('[Dashboard] 会话检查错误:', sessionError);
          setError('无法获取会话信息');
          setLoading(false);
          // 延迟重定向，给用户看到错误消息
          setTimeout(() => router.push('/'), 2000);
          return;
        }

        // 如果没有会话，重定向到登录页面
        if (!session) {
          console.log('[Dashboard] 没有找到活跃会话，重定向到登录页面');
          setLoading(false);
          router.push('/');
          return;
        }

        console.log('[Dashboard] ✅ 会话有效，用户:', session.user?.email);
        setUser(session.user);
        setLoading(false);
      } catch (err) {
        if (isMounted) {
          console.error('[Dashboard] 初始化时发生错误:', err);
          setError('发生错误，请重试');
          setLoading(false);
          setTimeout(() => router.push('/'), 2000);
        }
      }
    };

    initializeSession();

    // 监听认证状态变化
    // 这包括：登录、登出、令牌刷新等
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;

        console.log('[Dashboard] 认证状态变化:', event, session?.user?.email);

        switch (event) {
          case 'SIGNED_IN':
            console.log('[Dashboard] 用户已登录');
            if (session?.user) {
              setUser(session.user);
              setLoading(false);
            }
            break;

          case 'SIGNED_OUT':
            console.log('[Dashboard] 用户已登出');
            setUser(null);
            setLoading(false);
            router.push('/');
            break;

          case 'TOKEN_REFRESHED':
            console.log('[Dashboard] 令牌已刷新');
            if (session?.user) {
              setUser(session.user);
            }
            break;

          case 'USER_UPDATED':
            console.log('[Dashboard] 用户信息已更新');
            if (session?.user) {
              setUser(session.user);
            }
            break;

          default:
            break;
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
      console.log('[Dashboard] 正在登出...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('[Dashboard] 登出失败:', error);
        setError('登出失败，请重试');
        return;
      }

      console.log('[Dashboard] ✅ 登出成功');
      router.push('/');
    } catch (err) {
      console.error('[Dashboard] 登出时发生错误:', err);
      setError('登出时发生错误');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-xl text-red-600 font-semibold mb-2">未授权</p>
          <p className="text-gray-600">正在重定向到登录页面...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">仪表板</h1>
          <p className="text-gray-600 mb-6">欢迎回来！</p>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p className="font-semibold">错误</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">登录的用户邮箱：</p>
            <p className="text-lg font-semibold text-gray-800">{user.email}</p>
            <p className="text-xs text-gray-500 mt-3">用户 ID: {user.id}</p>
            {user.user_metadata?.avatar_url && (
              <div className="mt-3">
                <img
                  src={user.user_metadata.avatar_url}
                  alt="User Avatar"
                  className="h-12 w-12 rounded-full"
                />
              </div>
            )}
          </div>

          <div className="mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="flex items-center text-green-800">
              <span className="text-2xl mr-2">✓</span>
              <span>您已成功登录！</span>
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full px-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200 shadow-md"
          >
            退出登录
          </button>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              🔐 您的会话是安全的。我们使用 Supabase 的 OAuth 2.0 实现来保护您的账户。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
