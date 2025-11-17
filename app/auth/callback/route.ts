import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * OAuth 回调处理路由
 * 
 * 流程：
 * 1. Supabase 重定向 OAuth 授权码到此路由
 * 2. Supabase 自动将授权码添加到 URL 中
 * 3. 我们交换授权码获得会话
 * 4. 重定向到用户请求的页面或仪表板
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const redirectTo = requestUrl.searchParams.get('redirect_to') || '/dashboard';

  console.log('[auth/callback] 接收到回调请求');
  console.log('[auth/callback] 有授权码:', !!code);
  console.log('[auth/callback] 有错误:', !!error);

  // 处理 OAuth 提供商返回的错误
  if (error) {
    console.warn('[auth/callback] OAuth 错误:', error, errorDescription);
    const errorMsg = encodeURIComponent(errorDescription || error);
    return NextResponse.redirect(
      new URL(`/auth/auth-code-error?error=${errorMsg}`, requestUrl.origin)
    );
  }

  // 检查授权码是否存在
  if (!code) {
    console.warn('[auth/callback] 没有收到授权码');
    return NextResponse.redirect(
      new URL(
        '/auth/auth-code-error?error=no_code&message=GitHub未返回授权码，请检查回调URL配置',
        requestUrl.origin
      )
    );
  }

  try {
    // 创建服务器端 Supabase 客户端
    const supabase = createServerSupabaseClient();
    
    console.log('[auth/callback] 开始交换授权码获取会话...');
    
    // 交换授权码获得会话
    // Supabase 将自动处理并在响应头中设置 cookies
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('[auth/callback] 会话交换失败:', exchangeError.message);
      return NextResponse.redirect(
        new URL(
          `/auth/auth-code-error?error=${encodeURIComponent(exchangeError.message)}`,
          requestUrl.origin
        )
      );
    }

    if (!data.session) {
      console.error('[auth/callback] 未返回会话数据');
      return NextResponse.redirect(
        new URL('/auth/auth-code-error?error=no_session', requestUrl.origin)
      );
    }

    console.log('[auth/callback] ✅ 会话交换成功!');
    console.log('[auth/callback] 用户邮箱:', data.user?.email);
    console.log('[auth/callback] 用户 ID:', data.user?.id);

    // 创建重定向响应
    const response = NextResponse.redirect(
      new URL(redirectTo, requestUrl.origin)
    );

    // 设置缓存控制头以确保会话新鲜
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (err) {
    console.error('[auth/callback] 未预期的错误:', err);
    const errorMsg = err instanceof Error ? err.message : '未知错误';
    return NextResponse.redirect(
      new URL(
        `/auth/auth-code-error?error=${encodeURIComponent(errorMsg)}`,
        requestUrl.origin
      )
    );
  }
}
