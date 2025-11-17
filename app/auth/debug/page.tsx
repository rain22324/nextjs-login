'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface SessionInfo {
  exists: boolean;
  user?: {
    id: string;
    email: string;
    user_metadata?: any;
  };
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  error?: string;
}

export default function DebugPage() {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [storageInfo, setStorageInfo] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check active session
        const { data: { session }, error } = await supabase.auth.getSession();

        const info: SessionInfo = {
          exists: !!session,
        };

        if (error) {
          info.error = error.message;
        }

        if (session) {
          info.user = {
            id: session.user.id,
            email: session.user.email || '',
            user_metadata: session.user.user_metadata,
          };
          info.accessToken = session.access_token?.substring(0, 20) + '...';
          info.refreshToken = session.refresh_token?.substring(0, 20) + '...';
          info.expiresAt = session.expires_at;
        }

        setSessionInfo(info);

        // Check localStorage for Supabase keys
        const storage: Record<string, any> = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith('sb-')) {
            const value = localStorage.getItem(key);
            try {
              storage[key] = JSON.parse(value || '{}');
            } catch {
              storage[key] = value;
            }
          }
        }
        setStorageInfo(storage);
      } catch (err) {
        console.error('Debug check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>检查中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← 返回登录
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-gray-800">调试信息</h1>

        {/* Session Info */}
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">会话状态</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-semibold">会话存在：</span>
              <span className={sessionInfo?.exists ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                {sessionInfo?.exists ? '✓ 是' : '✗ 否'}
              </span>
            </div>

            {sessionInfo?.error && (
              <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700">
                <strong>错误：</strong> {sessionInfo.error}
              </div>
            )}

            {sessionInfo?.user && (
              <>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-semibold">用户 ID：</span>
                  <code className="text-sm">{sessionInfo.user.id}</code>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-semibold">邮箱：</span>
                  <span>{sessionInfo.user.email}</span>
                </div>
                {sessionInfo.expiresAt && (
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-semibold">过期时间：</span>
                    <span className="text-sm">{new Date(sessionInfo.expiresAt * 1000).toLocaleString()}</span>
                  </div>
                )}
                <div className="p-2 bg-green-50 rounded text-sm text-green-700">
                  <strong>✓ 用户已登录</strong>
                </div>
              </>
            )}

            {!sessionInfo?.exists && !sessionInfo?.error && (
              <div className="p-2 bg-yellow-50 rounded text-sm text-yellow-700">
                <strong>⚠ 没有活跃会话</strong>
              </div>
            )}
          </div>
        </div>

        {/* Storage Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">本地存储（localStorage）</h2>
          
          {Object.keys(storageInfo || {}).length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {Object.entries(storageInfo || {}).map(([key, value]) => (
                <details key={key} className="p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                  <summary className="font-semibold text-sm">{key}</summary>
                  <pre className="mt-2 text-xs bg-gray-900 text-green-400 p-2 rounded overflow-x-auto">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                </details>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-yellow-50 rounded text-sm text-yellow-700">
              <strong>⚠ 没有找到 Supabase 存储键</strong>
              <p className="mt-1 text-xs">这可能表示 Cookie 存储被禁用或浏览器处于隐私模式</p>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-3 text-blue-900">建议：</h2>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-2">
            <li>如果没有活跃会话，尝试重新登录</li>
            <li>如果 localStorage 为空，检查浏览器是否启用了 Cookie</li>
            <li>尝试在无痕模式下测试</li>
            <li>检查浏览器控制台中的错误消息</li>
            <li>清除所有本地数据后重试登录流程</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
