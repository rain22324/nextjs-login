# GitHub OAuth 测试和诊断指南

## 🚀 快速开始

### 1. 验证环境变量

确保 `.env.local` 文件存在并包含：
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

验证方式：
```bash
# 在项目根目录运行
cat .env.local
```

### 2. 访问应用

开发服务器应该正在运行在：
```
http://192.168.1.102:3000
```

如果不确定，运行：
```bash
npm run dev
```

## 🧪 测试流程

### 完整的 OAuth 流程测试

```
用户点击 "使用 GitHub 登录" 按钮
    ↓
浏览器跳转到 GitHub 认证页面
    ↓
用户输入 GitHub 凭证
    ↓
GitHub 要求授权
    ↓
用户批准授权
    ↓
GitHub 重定向回 http://192.168.1.102:3000/auth/callback?code=XXX&...
    ↓
本地服务器处理 /auth/callback 路由
    ↓
Supabase 交换授权码获取会话
    ↓
重定向到 /dashboard
    ↓
✅ 登录成功！
```

### 实际测试步骤

1. **打开浏览器开发者工具**：
   - Windows/Linux: `F12`
   - Mac: `Cmd + Option + I`

2. **切换到 Console 标签**

3. **访问应用首页**：
   ```
   http://192.168.1.102:3000
   ```

4. **点击 "使用 GitHub 登录" 按钮**

5. **观察以下内容**：
   - ✅ Console 中是否有 `[LoginForm] OAuth flow initiated for github` 日志
   - ✅ 页面是否开始重定向
   - ✅ URL 中是否显示 GitHub 域名

## 🔍 诊断工具

### 1. 会话调试页面

访问：
```
http://192.168.1.102:3000/auth/debug
```

这个页面显示：
- 当前登录状态
- 用户信息
- localStorage 中的会话令牌
- 会话过期时间

### 2. 浏览器 Console 日志

关键日志信息：

| 日志 | 含义 | 状态 |
|------|------|------|
| `[LoginForm] OAuth flow initiated for github` | OAuth 流程开始 | ✅ 正常 |
| `OAuth error with github:` | OAuth 出现错误 | ❌ 问题 |
| `[auth/callback] Full URL:` | 回调 URL | ✅ 验证用 |
| `[auth/callback] No authorization code provided` | 没有收到授权码 | ❌ URL 配置问题 |
| `[auth/callback] Successfully authenticated user:` | 认证成功 | ✅ 成功 |

### 3. Network 标签检查

1. 打开 DevTools → Network 标签
2. 清除日志（垃圾桶图标）
3. 点击 "使用 GitHub 登录"
4. 查找以下请求：

**请求 1**: 到 supabase 的 auth 请求
```
GET https://xxxx.supabase.co/auth/v1/authorize?...
状态: 302 (重定向)
→ 指向 GitHub 的 OAuth 终点
```

**请求 2**: GitHub 认证后回调
```
GET http://192.168.1.102:3000/auth/callback?code=...
状态: 应该是成功
```

## ❌ 常见问题和解决方案

### 问题 1: 点击按钮后没有反应

**症状**：
- 点击 "使用 GitHub 登录" 按钮无反应
- 没有跳转到 GitHub

**检查项**：
1. 打开 Console 查看错误消息
2. 确认网络连接正常
3. 清除浏览器缓存
4. 尝试其他浏览器

**解决方案**：
```typescript
// 如果看到网络错误，检查：
1. Supabase URL 是否正确配置
2. NEXT_PUBLIC_SUPABASE_ANON_KEY 是否正确
3. GitHub 提供商是否在 Supabase 中启用
```

### 问题 2: GitHub 显示错误（如 invalid_client）

**症状**：
```
error=invalid_client
error_description=Client authentication failed
```

**原因**：
- GitHub Client ID 或 Secret 错误
- GitHub 应用配置错误

**解决方案**：
1. 登录 GitHub Settings → Developers → OAuth Apps
2. 验证 Client ID 是否与 Supabase 中的匹配
3. 重新生成 Secret 并更新 Supabase

### 问题 3: 回调 URL 不匹配

**症状**：
```
error=redirect_uri_mismatch
```

**原因**：
GitHub 的回调 URL 与实际请求不匹配

**检查三个地方**：

1. **GitHub OAuth 应用设置**：
   ```
   https://github.com/settings/developers
   → 你的应用
   → Authorization callback URL
   ```

2. **Supabase Dashboard**：
   ```
   Authentication → Providers → GitHub
   → Callback URL (显示为只读)
   ```

3. **本地应用代码**：
   ```typescript
   // LoginForm.tsx
   redirectTo: `${window.location.origin}/auth/callback`
   ```

**必须完全一致！** 精确到最后一个字符。

### 问题 4: 收不到授权码（no_code 错误）

**症状**：
- 在 `/auth/callback` 页面看到 "no_code" 错误
- Console 显示 `No authorization code provided`

**原因**：
- GitHub 不信任回调 URL
- CSRF 令牌验证失败
- 本地 IP 与配置不匹配

**解决方案**：

1. **确认你使用的 IP**：
   ```bash
   # 在命令行查看你的本地 IP
   ipconfig getifaddr en0  # Mac
   ipconfig               # Windows
   ```

2. **GitHub 中使用同样的 IP**：
   ```
   Authorization callback URL: http://192.168.1.102:3000/auth/callback
   (不要用 localhost，必须用实际 IP)
   ```

3. **Supabase 中也配置同样的 URL**：
   ```
   Authentication → URL Configuration → Add
   http://192.168.1.102:3000/auth/callback
   ```

4. **重启服务器**：
   ```bash
   npm run dev
   ```

### 问题 5: 登录后不能进入 Dashboard

**症状**：
- OAuth 流程完成
- 但重定向失败或无法访问 Dashboard
- Console 显示错误

**解决方案**：

1. **查看会话调试页面**：
   ```
   http://192.168.1.102:3000/auth/debug
   ```
   - 检查 `session` 是否不为 null
   - 检查 `user` 信息是否存在

2. **清除 localStorage**：
   ```javascript
   // 在 Console 中运行
   localStorage.clear()
   location.reload()
   ```

3. **检查 Dashboard 权限**：
   - 确保 `/dashboard` 页面配置了会话检查
   - 验证 Dashboard 的重定向逻辑是否正确

## 📊 完整的诊断清单

使用这个清单来系统地诊断问题：

### 环境配置
- [ ] `.env.local` 文件存在
- [ ] `NEXT_PUBLIC_SUPABASE_URL` 已设置
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 已设置
- [ ] 值没有包含引号

### GitHub 配置
- [ ] GitHub OAuth 应用已创建
- [ ] Client ID 已复制
- [ ] Client Secret 已生成并复制
- [ ] Authorization callback URL 已设置为 `http://192.168.1.102:3000/auth/callback`

### Supabase 配置
- [ ] GitHub 提供商已启用
- [ ] Client ID 已输入
- [ ] Client Secret 已输入
- [ ] 已保存更改
- [ ] URL Configuration 包含回调 URL

### 本地测试
- [ ] 开发服务器正在运行
- [ ] 可以访问 `http://192.168.1.102:3000`
- [ ] 点击按钮时浏览器开发者工具 Console 有日志
- [ ] Network 标签显示到 GitHub 的请求

## 🛠️ 高级调试

### 查看完整的会话信息

在浏览器 Console 中运行：
```javascript
import { supabase } from '@/lib/supabase';

// 获取当前会话
const { data } = await supabase.auth.getSession();
console.log('Session:', data);
console.log('User:', data?.session?.user);
console.log('Access Token:', data?.session?.access_token);
console.log('Expires At:', data?.session?.expires_at);
```

### 查看完整的 OAuth 流程日志

本地服务器应该输出类似的日志：
```
[auth/callback] Full URL: http://192.168.1.102:3000/auth/callback?code=...&state=...
[auth/callback] Search params: { code: '...', state: '...', ... }
[auth/callback] Received OAuth callback with code: true
[auth/callback] Successfully authenticated user: user@example.com
```

### 重置所有数据重新测试

```bash
# 1. 清除所有数据
rm -rf .next
npm run build

# 2. 清除浏览器数据
# → DevTools → Application → Clear site data

# 3. 重启服务器
npm run dev

# 4. 再次尝试登录
```

## 📞 获取更多帮助

如果问题未解决，请收集以下信息：

1. **错误消息**（完整的 Console 输出）
2. **URL 配置**（三个地方的回调 URL）
3. **环境信息**（操作系统、浏览器、Node 版本）
4. **Network 请求信息**（截图或导出）

然后查看：
- [GITHUB_OAUTH_FIX.md](./GITHUB_OAUTH_FIX.md) - 完整的修复指南
- [Supabase 文档](https://supabase.com/docs/guides/auth/social-login/auth-github)
- [GitHub OAuth 文档](https://docs.github.com/en/developers/apps/building-oauth-apps)

---

**最后更新**: 2025年11月17日
