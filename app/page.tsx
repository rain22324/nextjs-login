'use client';

import LoginForm from '@/components/LoginForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">欢迎</h1>
          <p className="text-gray-600">使用 Supabase 认证系统登录</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
