# GitHub OAuth 会话持久化修复

## 问题总结

GitHub OAuth 登录流程虽然能够成功重定向并交换授权码，但用户的会话信息未能在客户端持久化，导致用户无法登录仪表板。

## 根本原因

OAuth 会话需要在以下三个阶段正确传递和保存：
1. **服务器端**：交换授权码获取会话令牌
2. **传输**：会话数据需要通过 URL 或 Cookie 返回给客户端
3. **客户端**：Supabase 客户端需要检测并保存会话

原始配置中缺少关键的会话同步机制。

## 实施的修复

### 1. **Supabase 客户端配置更新** (`lib/supabase.ts`)

添加了三个关键的认证选项：

```typescript
auth: {
  persistSession: true,      // ✓ 将会话持久化到浏览器存储
  autoRefreshToken: true,    // ✓ 自动刷新过期的令牌
  detectSessionInUrl: true,  // ✓ 从 URL 片段检测会话
}
```

**作用**：
- `persistSession: true` 将会话保存到浏览器的 `localStorage` 或 `sessionStorage`
- `autoRefreshToken: true` 确保令牌自动续期
- `detectSessionInUrl: true` 允许 Supabase 从 OAuth 回调的 URL 片段（`#`）解析会话

### 2. **OAuth 回调处理增强** (`app/auth/callback/route.ts`)

改进的服务器端回调处理：

```typescript
// 使用相同的认证配置创建 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// 交换授权码获取会话
const { data, error } = await supabase.auth.exchangeCodeForSession(code);
```

**改进**：
- 服务器端 Supabase 客户端现在使用相同的会话配置
- 添加了更详细的日志记录以便调试
- 改进的错误处理和错误消息传递

### 3. **仪表板客户端更新** (`app/dashboard/page.tsx`)

完全重写了会话检查和监听逻辑：

```typescript
useEffect(() => {
  const checkUser = async () => {
    // 首先检查活跃会话
    const { data: { session }, error: sessionError } = 
      await supabase.auth.getSession();

    if (!session) {
      // 重定向到登录
      router.push('/');
      return;
    }

    setUser(session.user);
  };

  checkUser();

  // 监听认证状态变化
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        router.push('/');
      }
    }
  );

  return () => subscription?.unsubscribe();
}, [router]);
```

**改进**：
- 添加了 `onAuthStateChange` 监听器以实时检测认证状态变化
- 改进的错误处理和用户反馈
- 安全的清理以防止内存泄漏

### 4. **错误页面改进** (`app/auth/auth-code-error/page.tsx`)

- 现在显示具体的错误消息
- 提供详细的调试步骤
- 添加了 Suspense 包装以支持 `useSearchParams()`

### 5. **调试页面** (`app/auth/debug/page.tsx`)

新建的调试工具页面，用于诊断会话问题：

- 显示当前的会话状态
- 列出浏览器 `localStorage` 中的 Supabase 键
- 提供常见问题的故障排除建议

## 测试步骤

### 1. 启动开发服务器

```bash
npm run dev
# 应该在 http://192.168.1.102:3001 启动
```

### 2. 测试 GitHub OAuth 流程

1. 访问 `http://192.168.1.102:3001`
2. 点击"使用 GitHub 登录"按钮
3. 在 GitHub 上授权应用程序
4. 应该被重定向到仪表板并看到您的用户信息

### 3. 验证会话持久化

1. 登录后，打开浏览器开发者工具（F12）
2. 导航到 **Application** 标签
3. 在 **Storage** 部分查找 **LocalStorage** 或 **SessionStorage**
4. 寻找以 `sb-` 开头的键（例如 `sb-https://escszoyuqevszvppkccb.supabase.co-auth-token`）
5. 这些键应该包含您的认证令牌

### 4. 使用调试页面

1. 访问 `http://192.168.1.102:3001/auth/debug`
2. 检查：
   - **会话存在** 应显示 "✓ 是"
   - **localStorage** 部分应列出 Supabase 键

## 故障排除

### 问题：登录后仍被重定向到登录页面

**解决步骤**：

1. **检查浏览器控制台**
   - 打开开发者工具 (F12) → Console
   - 查找任何错误消息
   - 复制完整的错误堆栈

2. **验证 Cookie 设置**
   - 访问 DevTools → Application → Cookies
   - 应该看到 Supabase 相关的 Cookie
   - 确保没有被"仅限 HTTPS"或隐私设置阻止

3. **检查 Supabase 日志**
   - 登录 [Supabase Dashboard](https://app.supabase.com)
   - 进入您的项目 → Logs → Auth
   - 查找与您登录尝试相关的条目

4. **清除所有本地数据**
   ```javascript
   // 在浏览器控制台运行
   localStorage.clear();
   sessionStorage.clear();
   // 然后重新加载页面并重试
   ```

### 问题：GitHub 登录按钮无反应

1. 确保回调 URL 在 GitHub 和 Supabase 中都正确配置为 `http://192.168.1.102:3001/auth/callback`
2. 检查是否启用了弹出窗口阻止程序
3. 查看浏览器控制台是否有 CORS 错误

### 问题：出现"OAuth state parameter missing"错误

这通常表示：
- 会话未正确从服务器传递到客户端
- 重定向 URL 与注册的回调 URL 不匹配
- 浏览器 Cookie 被阻止

**解决**：
1. 确保 `redirectTo` 与回调 URL 完全匹配
2. 在浏览器中启用第三方 Cookie
3. 不要在隐私/无痕模式下测试

## 关键配置清单

- [ ] `.env.local` 包含正确的 Supabase URL 和匿名密钥
- [ ] GitHub OAuth 提供程序在 Supabase 中已启用
- [ ] 回调 URL 在 GitHub 和 Supabase 中设置为 `http://192.168.1.102:3001/auth/callback`
- [ ] 浏览器 Cookie 已启用
- [ ] 不在隐私/无痕模式下测试
- [ ] Node.js 开发服务器正在运行

## 相关文件变更摘要

| 文件 | 更改 |
|------|------|
| `lib/supabase.ts` | 添加认证配置选项 |
| `app/auth/callback/route.ts` | 改进会话交换和日志记录 |
| `app/dashboard/page.tsx` | 添加会话监听和错误处理 |
| `app/auth/auth-code-error/page.tsx` | 改进错误处理和 Suspense 支持 |
| `app/auth/debug/page.tsx` | 新建调试工具页面 |
| `components/LoginForm.tsx` | 添加调试链接 |

## 下一步

如果问题仍未解决，请：

1. 访问 `/auth/debug` 页面并检查会话状态
2. 查看浏览器控制台错误消息
3. 检查 Supabase 认证日志
4. 确保所有环境变量正确设置
5. 尝试清除浏览器 Cookie 和本地存储后重试

## 参考资源

- [Supabase OAuth Documentation](https://supabase.com/docs/guides/auth/oauth)
- [Supabase Auth-Helpers for Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Next.js useSearchParams Documentation](https://nextjs.org/docs/app/api-reference/functions/use-search-params)
