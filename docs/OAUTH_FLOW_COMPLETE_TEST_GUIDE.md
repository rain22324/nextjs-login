# OAuth 流程完整测试指南

**日期**: 2025年11月17日  
**版本**: 3.0 - 服务器端会话处理验证

## 🎯 测试目标

验证改进的 OAuth 流程：
1. ✅ 服务器端 Supabase 客户端正确工作
2. ✅ OAuth 授权码正确交换为会话
3. ✅ Dashboard 会话检查和认证事件处理
4. ✅ 用户登出功能
5. ✅ 令牌自动刷新

## 📋 测试前检查清单

- [ ] 环境变量配置正确
  ```bash
  # .env.local 应包含
  NEXT_PUBLIC_SUPABASE_URL=your-project-url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  ```

- [ ] GitHub OAuth App 已配置
  - Authorized redirect URLs: `http://localhost:3000/auth/callback`

- [ ] 本地依赖已安装
  ```bash
  npm install
  ```

- [ ] 代码构建成功
  ```bash
  npm run build
  ```

## 🚀 快速测试 (5 分钟)

### 步骤 1: 启动开发服务器

```bash
npm run dev
```

**预期输出**:
```
▲ Next.js 16.0.1
- Local:        http://localhost:3000
- Environments: .env.local
```

### 步骤 2: 打开浏览器开发者工具

```
按 F12 打开开发者工具
进入 Console 标签页
```

### 步骤 3: 访问首页

```
在浏览器中打开 http://localhost:3000
```

**预期结果**:
- ✅ 页面加载成功
- ✅ 看到 "使用 GitHub 登录" 按钮
- ✅ 控制台无错误

### 步骤 4: 点击登录按钮

```
点击 "使用 GitHub 登录" 按钮
```

**预期结果**:
- ✅ 跳转到 GitHub OAuth 授权页面
- ✅ 可以看到应用权限请求

### 步骤 5: 授权登录

```
点击 "授权" 按钮
```

**预期结果**:
- ✅ GitHub 重定向回 `/auth/callback?code=...&state=...`
- ✅ 浏览器自动重定向到 `/dashboard`
- ✅ 显示用户信息和 GitHub 头像

### 步骤 6: 检查控制台日志

```
在浏览器 Console 中查看日志
```

**预期日志** (来自 `app/dashboard/page.tsx`):
```
[Dashboard] 初始化会话检查...
[Dashboard] 用户已登入
[Dashboard] 用户信息：{...}
```

### 步骤 7: 测试登出

```
点击 "登出" 按钮
```

**预期结果**:
- ✅ 显示 "已登出，2秒后返回首页" 消息
- ✅ 2 秒后自动跳转到首页
- ✅ 控制台显示 SIGNED_OUT 事件

## 🔍 详细测试

### 测试 1: 检查服务器端回调处理

**目标**: 验证 `/auth/callback` 正确处理授权码

**步骤**:

1. 打开 Network 标签页 (F12 → Network)
2. 点击登录按钮
3. 在 GitHub 授权后观察网络请求

**检查项**:
- [ ] 存在对 `http://localhost:3000/auth/callback?code=...` 的请求
- [ ] 响应状态为 307 (重定向)
- [ ] 响应头包含 `Location: /dashboard` 或 `/auth/auth-code-error`
- [ ] 响应头包含 `Cache-Control: no-cache, no-store, must-revalidate`

**预期网络流程**:
```
1. POST /auth/callback?code=... (307 Redirect)
   ↓
2. GET /dashboard (200 OK)
   ↓
3. 显示用户信息
```

### 测试 2: 检查会话数据

**目标**: 验证会话已正确保存

**步骤**:

1. 打开浏览器开发者工具
2. 进入 Application 标签页
3. 进入 Cookies 部分
4. 找到 `localhost` 的 cookies

**检查项**:
- [ ] 存在名为 `sb-<project-id>-auth-token` 的 cookie
- [ ] Cookie 包含有效的 JWT token
- [ ] Cookie 标记为 Secure (生产环境)
- [ ] Cookie 标记为 HttpOnly

### 测试 3: 检查认证事件

**目标**: 验证 Dashboard 能正确处理认证事件

**步骤**:

1. 打开 Console
2. 登出再登录
3. 观察控制台日志

**预期日志序列**:
```
[Dashboard] 初始化会话检查...
[Dashboard] 用户已登入
[Dashboard] 用户信息：{...}

// ... (做一些操作) ...

[Dashboard] 用户已登出
```

**检查项**:
- [ ] 看到 `[Dashboard] 用户已登入` 日志
- [ ] 登出时看到 `[Dashboard] 用户已登出` 日志
- [ ] 看到 `[Dashboard] 令牌已刷新` 日志 (经过一段时间)
- [ ] 看到 `[Dashboard] 用户信息已更新` 日志 (更新用户时)

### 测试 4: 检查错误处理

**目标**: 验证错误正确处理

**步骤**:

1. 修改 NEXT_PUBLIC_SUPABASE_ANON_KEY 中的一个字符
2. 清除浏览器 cookies
3. 尝试登录

**预期结果**:
- ✅ 看到错误页面 `/auth/auth-code-error`
- ✅ 显示错误信息
- ✅ 控制台显示错误日志

### 测试 5: 会话持久化

**目标**: 验证会话在页面刷新后保持

**步骤**:

1. 登录到 Dashboard
2. 按 F5 刷新页面
3. 观察页面行为

**预期结果**:
- ✅ 页面刷新后仍显示用户信息
- ✅ 没有闪烁或重定向
- ✅ 控制台显示会话正确恢复

### 测试 6: 多标签页同步

**目标**: 验证多个标签页中的会话同步

**步骤**:

1. 在标签页 A 中登录
2. 在新标签页 B 中打开应用
3. 标签页 B 应该自动显示已登录状态

**预期结果**:
- ✅ 标签页 B 自动识别已登录状态
- ✅ 显示用户信息

### 测试 7: 令牌刷新

**目标**: 验证过期令牌自动刷新

**步骤**:

1. 登录到 Dashboard
2. 打开浏览器 DevTools，进入 Application → Storage → Cookies
3. 找到 `sb-<project-id>-auth-token` cookie
4. 等待一段时间或使用 Network 标签页查看自动刷新请求

**预期结果**:
- ✅ 看到对 Supabase 的自动刷新请求
- ✅ 令牌自动更新
- ✅ 用户不需要重新登录

## 🐛 故障排查

### 问题 1: 登录后仍然重定向到首页

**可能原因**:
- [ ] 会话未正确保存
- [ ] Cookie 被浏览器阻止
- [ ] Supabase 项目 URL 或 API 密钥错误

**解决步骤**:
1. 检查 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. 检查浏览器 Console 中的错误消息
3. 检查 Supabase 项目是否有有效的 GitHub OAuth 提供商配置

### 问题 2: 获得 "no_code" 错误

**可能原因**:
- [ ] GitHub OAuth App 的回调 URL 不正确
- [ ] Supabase GitHub 提供商未正确配置
- [ ] 回调 URL 中缺少 port (localhost:3000 而不是 localhost)

**解决步骤**:
1. 检查 GitHub OAuth App 设置中的 Authorized redirect URIs
2. 检查 Supabase 中的 GitHub 提供商配置
3. 确保开发环境和生产环境的 URL 匹配

### 问题 3: 控制台中没有预期的日志

**可能原因**:
- [ ] 日志输出到了 server 控制台而不是浏览器控制台
- [ ] 浏览器控制台被清空了
- [ ] 部分日志被浏览器 DevTools 过滤了

**解决步骤**:
1. 检查 VS Code 终端中的输出 (服务器端日志)
2. 在浏览器 Console 中取消勾选 "过滤" 选项
3. 重新加载页面以查看所有日志

### 问题 4: "无法获取会话信息" 错误

**可能原因**:
- [ ] Supabase 项目不可访问
- [ ] API 密钥无效
- [ ] 浏览器网络连接有问题

**解决步骤**:
1. 检查网络连接
2. 验证 Supabase 项目 URL 可以访问
3. 检查浏览器 Console 中的完整错误信息

## 📊 测试结果记录

### 测试环境信息
- 操作系统: _________________
- 浏览器: _________________
- Node 版本: _________________
- Next.js 版本: 16.0.1
- @supabase/supabase-js 版本: 2.81.1
- @supabase/ssr 版本: 0.0.1

### 测试结果

#### 快速测试 (5 分钟)
- [ ] 步骤 1: 开发服务器启动
- [ ] 步骤 2: 开发者工具打开
- [ ] 步骤 3: 首页加载成功
- [ ] 步骤 4: 登录按钮工作
- [ ] 步骤 5: GitHub 授权成功
- [ ] 步骤 6: 控制台日志正常
- [ ] 步骤 7: 登出功能工作

#### 详细测试
- [ ] 测试 1: 服务器端回调处理 ✅/❌
- [ ] 测试 2: 会话数据保存 ✅/❌
- [ ] 测试 3: 认证事件处理 ✅/❌
- [ ] 测试 4: 错误处理 ✅/❌
- [ ] 测试 5: 会话持久化 ✅/❌
- [ ] 测试 6: 多标签页同步 ✅/❌
- [ ] 测试 7: 令牌刷新 ✅/❌

#### 故障排查
- [ ] 问题 1: 登录后重定向 ✅/❌
- [ ] 问题 2: "no_code" 错误 ✅/❌
- [ ] 问题 3: 日志输出 ✅/❌
- [ ] 问题 4: 会话信息错误 ✅/❌

### 总体结果
- 所有测试通过: ✅/❌
- 遇到的问题: _____________________________________
- 需要进一步调查: _________________________________

## 📝 下一步

1. **完成本测试指南** - 所有测试项目都应通过
2. **记录测试结果** - 在上面的表格中填写结果
3. **部署到生产** - 如果所有测试都通过
4. **监控日志** - 部署后观察生产环境的行为

---

**📚 相关文档**:
- [SUPABASE_SERVER_SESSION_BEST_PRACTICES.md](./SUPABASE_SERVER_SESSION_BEST_PRACTICES.md)
- [TESTING.md](./TESTING.md)
- [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

**✨ 测试完成后，你的 OAuth 流程将完全现代化！**
