# GitHub OAuth 修复指南 - 按官方文档实施

## 📋 问题概述

根据 Supabase 官方文档 ([auth-github](https://supabase.com/docs/guides/auth/social-login/auth-github?environment=client))，我们的 GitHub OAuth 实现需要严格遵循以下规范。

## ✅ 已实施的修复

### 1. **Client 端 OAuth 登录实现** (`components/LoginForm.tsx`)

#### 修复内容：
- ✅ 使用 `supabase.auth.signInWithOAuth()` 进行登录
- ✅ 在 `options` 中正确设置 `redirectTo`
- ✅ 添加详细的错误日志和用户提示
- ✅ 正确处理 OAuth 流程的异步问题

#### 关键代码：
```typescript
const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    },
  },
});
```

**为什么这样做：**
- `window.location.origin` 动态获取当前应用域名
- `redirectTo` 必须与 GitHub 和 Supabase 中配置的回调 URL 完全一致
- `access_type: 'offline'` 获取刷新令牌
- `prompt: 'consent'` 确保用户同意授权

### 2. **Server 端回调处理** (`app/auth/callback/route.ts`)

#### 修复内容：
- ✅ 正确提取授权码 (code)
- ✅ 使用 `exchangeCodeForSession()` 交换会话
- ✅ 完整的错误处理机制
- ✅ 设置缓存控制头确保会话新鲜

#### 关键流程：
```typescript
// 1. 获取授权码
const code = searchParams.get('code');

// 2. 交换会话
const { data, error } = await supabase.auth.exchangeCodeForSession(code);

// 3. 设置必要的缓存头
response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
```

### 3. **Supabase 客户端配置** (`lib/supabase.ts`)

#### 修复内容：
- ✅ 启用会话持久化 `persistSession: true`
- ✅ 启用令牌自动刷新 `autoRefreshToken: true`
- ✅ 启用 URL 中会话检测 `detectSessionInUrl: true`

```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
```

## 🔧 必需的配置步骤

要使 GitHub OAuth 正常工作，你需要完成以下配置：

### 步骤 1：获取回调 URL

在 Supabase Dashboard 中：
1. 进入 **Authentication** → **Providers** → **GitHub**
2. 复制显示的 **Callback URL**，格式如：
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```

### 步骤 2：配置 GitHub OAuth 应用

在 [GitHub OAuth Settings](https://github.com/settings/developers) 中：

1. **创建新的 OAuth 应用** 或 编辑现有应用
2. 设置以下信息：
   - **Application name**: 你的应用名称
   - **Homepage URL**: `http://192.168.1.102:3000` (开发)
   - **Authorization callback URL**: 
     - 本地开发: `http://192.168.1.102:3000/auth/callback`
     - 生产环境: `https://yourdomain.com/auth/callback`

3. 生成 **Client Secret**（不要泄露！）

### 步骤 3：在 Supabase 中启用 GitHub

1. 进入 Supabase Dashboard
2. 导航到 **Authentication** → **Providers**
3. 找到 **GitHub** 提供商
4. 切换 **Enable** 为 ON
5. 粘贴 GitHub 的：
   - **Client ID**
   - **Client Secret**
6. 点击 **Save**

### 步骤 4：配置回调 URL 白名单

在 Supabase Dashboard 的 **Authentication** → **URL Configuration** 中：

添加允许的回调 URL：
```
http://192.168.1.102:3000/auth/callback
http://localhost:3000/auth/callback
https://yourdomain.com/auth/callback
```

## 🧪 测试 GitHub OAuth

### 本地测试

1. **启动开发服务器**：
   ```bash
   npm run dev
   ```

2. **访问应用**：
   ```
   http://192.168.1.102:3000
   ```

3. **点击 "使用 GitHub 登录" 按钮**

4. **预期行为**：
   - ✅ 重定向到 GitHub 登录页面
   - ✅ 输入 GitHub 凭证
   - ✅ GitHub 显示授权确认页面
   - ✅ 批准后重定向回 `/auth/callback`
   - ✅ 成功后重定向到 `/dashboard`

### 调试问题

如果遇到问题，检查以下项：

1. **打开浏览器开发者工具** (F12)
2. **查看 Console 标签** 获取错误日志
3. **查看 Network 标签** 跟踪 OAuth 流程

常见错误及解决方案：

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| `no_code` | GitHub 没有返回授权码 | 检查回调 URL 配置是否匹配 |
| `invalid_client` | Client ID 或 Secret 错误 | 检查 GitHub 和 Supabase 中的凭证 |
| `redirect_uri_mismatch` | 回调 URL 不匹配 | 确保所有三个地方配置相同 |
| `No session returned` | 会话交换失败 | 检查 Supabase 凭证和网络连接 |

## 📍 三个关键的 URL 配置点

必须完全一致！

```
1. GitHub OAuth App 配置:
   Authorization callback URL = http://192.168.1.102:3000/auth/callback

2. Supabase Dashboard:
   Authentication → URL Configuration → Redirect URLs
   http://192.168.1.102:3000/auth/callback

3. LoginForm.tsx 中的代码:
   redirectTo: `${window.location.origin}/auth/callback`
   (这会自动变成 http://192.168.1.102:3000/auth/callback)
```

## 🚀 生产部署注意事项

部署到生产环境时：

1. **更新 GitHub OAuth 应用**：
   - Authorization callback URL: `https://yourdomain.com/auth/callback`

2. **更新 Supabase URL 配置**：
   - 添加 `https://yourdomain.com/auth/callback` 到白名单

3. **更新环境变量**：
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **部署到 Vercel**：
   ```bash
   git push origin main
   # Vercel 会自动构建和部署
   ```

## ✔️ 配置检查清单

在测试 GitHub OAuth 前，确保完成：

- [ ] GitHub 凭证已生成（Client ID 和 Secret）
- [ ] GitHub 中配置了正确的回调 URL
- [ ] Supabase 已启用 GitHub 提供商
- [ ] Supabase 中输入了 GitHub 凭证
- [ ] Supabase URL 配置白名单包含你的回调 URL
- [ ] `.env.local` 包含 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] 开发服务器正在运行
- [ ] 使用正确的 URL 访问应用（IP:端口 或 域名）

## 📚 参考资源

- [Supabase GitHub OAuth 官方文档](https://supabase.com/docs/guides/auth/social-login/auth-github)
- [Supabase Redirect URLs 配置](https://supabase.com/docs/guides/auth/redirect-urls)
- [GitHub OAuth 应用创建](https://github.com/settings/developers)
- [Supabase Auth 错误代码](https://supabase.com/docs/guides/auth/debugging/error-codes)

## 🎯 下一步

1. ✅ 代码已按官方文档修正
2. ⏭️ 请按照上面的"必需的配置步骤"完成 GitHub 和 Supabase 配置
3. ⏭️ 使用"测试 GitHub OAuth"部分验证功能
4. ⏭️ 如果仍有问题，查看"调试问题"部分

---

**最后更新**: 2025年11月17日  
**适用版本**: Next.js 16.0, Supabase 2.81.1, @supabase/ssr 0.0.1
