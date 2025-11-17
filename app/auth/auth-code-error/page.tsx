'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const message = searchParams.get('message');

  // 特殊处理 no_code 错误
  const isNoCodeError = error === 'no_code';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            认证出错
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            处理您的登录请求时出现问题。请重试。
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {error && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>错误代码：</strong> {error}
              </p>
              {message && (
                <p className="text-sm text-yellow-700 mt-2">
                  <strong>详情：</strong> {message}
                </p>
              )}
            </div>
          )}

          {isNoCodeError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-semibold mb-2">
                ⚠️ GitHub 未返回授权码：
              </p>
              <ol className="list-decimal list-inside text-sm text-red-700 space-y-1">
                <li><strong>检查回调 URL：</strong>
                  <div className="bg-white p-2 mt-1 rounded text-xs break-all">
                    <code>http://192.168.1.102:3000/auth/callback</code>
                  </div>
                </li>
                <li>在 Supabase Dashboard → Authentication → Providers → GitHub 中验证回调 URL 完全匹配</li>
                <li>在 GitHub OAuth 应用设置中验证 Authorization callback URL 正确</li>
                <li>两个配置都应该是：<code className="bg-white px-1">http://192.168.1.102:3000/auth/callback</code></li>
              </ol>
            </div>
          )}

          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-semibold mb-2">
              可能的原因：
            </p>
            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
              <li>GitHub OAuth provider 未正确启用</li>
              <li>回调 URL 配置不匹配</li>
              <li>会话已过期或无效</li>
              <li>网络连接问题</li>
              <li>浏览器隐私模式影响 Cookie 存储</li>
            </ul>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-semibold mb-2">
              调试步骤：
            </p>
            <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
              <li>检查浏览器 DevTools 控制台的错误消息</li>
              <li>验证 Supabase Dashboard GitHub provider 已启用</li>
              <li>确认回调 URL 设置为 https://yourdomain.com/auth/callback</li>
              <li>检查 Supabase Auth 日志了解详情</li>
              <li>确保浏览器 Cookie 存储已启用</li>
            </ol>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              返回登录
            </Link>
            <Link
              href="/dashboard"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              去仪表板
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthCodeError() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">加载中...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
