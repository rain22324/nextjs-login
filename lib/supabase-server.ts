import { createClient } from '@supabase/supabase-js';

/**
 * 创建服务器端 Supabase 客户端
 * 用于在 Next.js 服务器路由中使用
 * 
 * 特点：
 * - 在服务器端处理 OAuth 回调
 * - 安全地交换授权码
 * - 管理会话
 */
export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false, // 禁用客户端持久化，因为这是服务器
        autoRefreshToken: true,
        detectSessionInUrl: false, // 我们手动处理
      },
    }
  );
}
