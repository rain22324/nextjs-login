# 🚀 GitHub OAuth 快速参考卡

## ⚡ 30 秒快速查看

### 做了什么？
✅ 按 Supabase 官方标准重写 GitHub OAuth 实现
✅ 创建了 4 份详细文档
✅ 代码已编译通过，零错误

### 立即测试
```bash
# 1. 开发服务器应该在运行
http://192.168.1.102:3000 或 3001

# 2. 点击 "使用 GitHub 登录"
# 应该重定向到 GitHub → 进入 Dashboard

# 3. 如果失败，查看 console.log
F12 → Console 标签
```

### 三个配置地方
```
1️⃣  GitHub (github.com/settings/developers)
    Authorization callback URL: http://192.168.1.102:3000/auth/callback

2️⃣  Supabase (supabase.com/dashboard)
    Authentication → Providers → GitHub → 启用 + 输入凭证
    Authentication → URL Configuration → 添加回调 URL

3️⃣  应用代码 (components/LoginForm.tsx)
    redirectTo: `${window.location.origin}/auth/callback`
    (应该自动变成上面的 URL)
```

**必须完全一致！**

## 📚 文档导航

| 需要 | 文档 |
|------|------|
| 完整修复指南 | [GITHUB_OAUTH_FIX.md](./GITHUB_OAUTH_FIX.md) |
| 测试 & 诊断 | [OAUTH_TESTING_GUIDE.md](./OAUTH_TESTING_GUIDE.md) |
| 实现摘要 | [OAUTH_IMPLEMENTATION_SUMMARY.md](./OAUTH_IMPLEMENTATION_SUMMARY.md) |
| 完成报告 | [OAUTH_FIX_COMPLETE.md](./OAUTH_FIX_COMPLETE.md) |

## 🔍 常见错误速查

| 错误 | 原因 | 修复 |
|------|------|------|
| `no_code` | URL 不匹配 | 检查三个地方的 URL 一致性 |
| `invalid_client` | Client ID/Secret 错误 | 检查 Supabase 中的 GitHub 凭证 |
| `redirect_uri_mismatch` | 回调 URL 不符 | 同上 |
| 卡在登录页 | 配置不完整 | 查看 [GITHUB_OAUTH_FIX.md](./GITHUB_OAUTH_FIX.md) 的配置步骤 |

## ✅ 配置检查 (60 秒)

```bash
# 1. 检查环境变量
cat .env.local
# 应该有 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY

# 2. 检查 GitHub 应用
# → https://github.com/settings/developers
# → 找到你的应用
# → 记住 Authorization callback URL

# 3. 检查 Supabase
# → supabase.com/dashboard
# → Authentication → Providers → GitHub
# → 确认已启用，有 Client ID/Secret

# 4. 检查回调 URL 白名单
# → Authentication → URL Configuration
# → 应该包含 http://192.168.1.102:3000/auth/callback
```

## 💻 开发服务器

```bash
# 启动
npm run dev

# 应该输出
# Local: http://localhost:3000 (或 3001)
# Network: http://192.168.1.102:3000 (或 3001)

# 访问应用
http://192.168.1.102:3000  # 用这个，不要用 localhost
```

## 🧪 浏览器调试

```javascript
// Console 中执行这些获取调试信息

// 1. 查看会话
const { data } = await supabase.auth.getSession();
console.log(data);

// 2. 查看 localStorage
console.log(localStorage);

// 3. 查看所有 cookies
console.log(document.cookie);

// 4. 清除所有数据（重新开始）
localStorage.clear();
location.reload();
```

## 🎯 预期的 Console 日志

```
[LoginForm] OAuth flow initiated for github  // ✅ 正常
OAuth error with github:                     // ❌ 有问题
[auth/callback] Successfully authenticated user: // ✅ 成功
[auth/callback] No authorization code provided   // ❌ 配置问题
```

## 📊 关键改进

| 改进 | 说明 |
|------|------|
| queryParams | 添加了 `access_type: 'offline'` 和 `prompt: 'consent'` |
| 错误处理 | 更详细的错误日志和用户提示 |
| 符合标准 | 完全符合 Supabase 官方实现 |

## 🚀 部署前清单

- [ ] 本地测试成功
- [ ] 没有 Console 错误
- [ ] 三个地方的 URL 一致
- [ ] 环境变量正确

## 📞 遇到问题？

1. **查看 Console** (F12 → Console)
2. **对照错误速查表**
3. **查看 [OAUTH_TESTING_GUIDE.md](./OAUTH_TESTING_GUIDE.md) 的问题排查**
4. **查看 [GITHUB_OAUTH_FIX.md](./GITHUB_OAUTH_FIX.md) 的完整步骤**

## 📖 完整文档

所有 OAuth 相关文档：
- 📋 [GITHUB_OAUTH_FIX.md](./GITHUB_OAUTH_FIX.md) - 完整修复
- 🧪 [OAUTH_TESTING_GUIDE.md](./OAUTH_TESTING_GUIDE.md) - 测试诊断
- 📊 [OAUTH_IMPLEMENTATION_SUMMARY.md](./OAUTH_IMPLEMENTATION_SUMMARY.md) - 实现摘要
- ✅ [OAUTH_FIX_COMPLETE.md](./OAUTH_FIX_COMPLETE.md) - 完成报告
- 📚 [docs/INDEX.md](./docs/INDEX.md) - 所有文档索引

---

**快速访问链接**:
- 🏠 [PROJECT_README.md](./PROJECT_README.md) - 项目首页
- 🚀 [QUICKSTART.md](./QUICKSTART.md) - 快速开始
- 🔧 [/auth/debug](http://192.168.1.102:3000/auth/debug) - 会话调试工具

Good Luck! 🎉
