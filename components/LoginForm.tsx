'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) throw signUpError;

      setMessage('检查您的邮件以验证账户');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        setMessage('登录成功！');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'github') => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (oauthError) throw oauthError;

      // For OAuth the user is redirected; show a friendly message in case provider
      // uses a popup flow or the redirect is delayed.
      setMessage(`正在使用 ${provider} 登录，稍等...`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '社交登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">用户登录</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => handleOAuthSignIn('github')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black disabled:opacity-60 transition"
            aria-label="Sign in with GitHub"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 .5C5.73.5.75 5.48.75 11.76c0 4.9 3.18 9.06 7.59 10.53.56.1.77-.24.77-.54 0-.27-.01-1-.02-1.96-3.09.67-3.74-1.5-3.74-1.5-.5-1.27-1.23-1.61-1.23-1.61-1.01-.69.08-.67.08-.67 1.12.08 1.71 1.15 1.71 1.15.99 1.69 2.6 1.2 3.24.92.1-.72.39-1.2.71-1.48-2.47-.28-5.07-1.24-5.07-5.5 0-1.21.43-2.2 1.14-2.97-.11-.28-.5-1.42.11-2.97 0 0 .94-.3 3.08 1.14.9-.25 1.86-.38 2.82-.38.96 0 1.92.13 2.82.38 2.14-1.44 3.08-1.14 3.08-1.14.61 1.55.22 2.69.11 2.97.71.77 1.14 1.76 1.14 2.97 0 4.27-2.61 5.21-5.09 5.49.4.35.75 1.04.75 2.1 0 1.52-.01 2.74-.01 3.11 0 .3.2.65.78.54 4.41-1.47 7.59-5.63 7.59-10.53C23.25 5.48 18.27.5 12 .5z" />
            </svg>
            <span className="text-sm font-medium">使用 GitHub 登录</span>
          </button>
        </div>

        <div className="flex items-center gap-2 my-2">
          <span className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-500">或使用邮箱登录</span>
          <span className="flex-1 h-px bg-gray-200" />
        </div>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              邮箱
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱地址"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={handleSignIn}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition"
            >
              {loading ? '处理中...' : '登录'}
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition"
            >
              {loading ? '处理中...' : '注册'}
            </button>
          </div>
        </form>
      </div>
  </div>
  );
}
