# Vercel 部署指南 - OAuth 修复后

## 📦 部署前的准备

### 1. 提交代码到 GitHub

```bash
# 添加所有修改
git add .

# 提交修改
git commit -m "Fix: OAuth session persistence issue with Supabase

- Add persistent session configuration to Supabase client
- Enhance OAuth callback handling with proper session exchange
- Improve dashboard session detection with listener
- Add debug page for troubleshooting
- Fix browser storage detection and error handling"

# 推送到远程
git push origin main
```

### 2. 验证本地测试

在部署前，确保：
```bash
# 构建测试
npm run build
# ✓ 构建成功无错误

# 开发测试
npm run dev
# ✓ 在 localhost:3000 正常运行
# ✓ GitHub OAuth 正常工作
# ✓ 能够进入仪表板
```

## 🚀 Vercel 部署步骤

### 方法 1：自动部署（推荐）

如果已连接 GitHub 到 Vercel：

1. **推送代码到 GitHub**
   ```bash
   git push origin main
   ```

2. **Vercel 自动检测并部署**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 观察部署进度
   - 等待部署完成（通常 2-5 分钟）

### 方法 2：手动部署

```bash
# 使用 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署
vercel

# 部署到生产环境
vercel --prod
```

## ⚙️ Vercel 环境变量配置

在 Vercel Dashboard 中配置这些环境变量：

### 1. 访问项目设置
1. 打开 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 点击 **Settings** 标签
4. 左侧菜单 → **Environment Variables**

### 2. 添加环境变量

```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://escszoyuqevszvppkccb.supabase.co
Environments: Production, Preview, Development
```

```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: <your-anon-key>
Environments: Production, Preview, Development
```

### 3. 验证 `vercel.json` 配置

你的 `vercel.json` 应该如下所示：

```json
{
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
```

**注意**：环境变量以 `@` 开头是指向 Vercel 密钥的引用。

## 🔗 更新 OAuth 回调 URL

在 Vercel 部署后，你需要更新：

### 1. 在 GitHub OAuth 应用中

1. 打开 [GitHub Settings → Developer settings → OAuth apps](https://github.com/settings/developers)
2. 选择你的 OAuth 应用
3. 更新 **Authorization callback URL**：
   ```
   https://your-vercel-app.vercel.app/auth/callback
   ```
   （将 `your-vercel-app` 替换为你的实际 Vercel 项目名）

### 2. 在 Supabase 中

1. 打开 [Supabase Dashboard](https://app.supabase.com)
2. 选择你的项目
3. 点击 **Authentication** → **Providers** → **GitHub**
4. 更新 **Redirect URL** 为：
   ```
   https://your-vercel-app.vercel.app/auth/callback
   ```

## ✅ 部署后验证

### 1. 检查部署日志
```bash
# 查看部署日志
vercel logs <project-name>
```

### 2. 访问你的应用
```
https://your-vercel-app.vercel.app
```

### 3. 测试 OAuth 流程
1. 点击"使用 GitHub 登录"
2. 完成授权流程
3. 验证能否进入仪表板

### 4. 检查错误（如果有）
- 访问 `/auth/debug` 页面
- 查看仪表板是否显示用户信息
- 检查浏览器控制台（F12）

## 🐛 部署常见问题

### 问题：部署失败 - TypeScript 错误

**解决**：
```bash
# 本地验证
npm run build
npm run lint

# 修复问题后重新推送
git add .
git commit -m "Fix build errors"
git push origin main
```

### 问题：环境变量未被识别

**解决**：
1. 确认变量已在 Vercel Dashboard 中设置
2. 确认变量名称完全正确
3. 重新部署以确保变量被读取
   ```bash
   vercel --prod --force
   ```

### 问题：OAuth 回调失败

**解决**：
1. 验证 GitHub 回调 URL 正确
2. 验证 Supabase 回调 URL 正确
3. 检查两者是否完全匹配（包括 https 和末尾的 `/auth/callback`）

### 问题：会话在生产中不工作

**解决**：
1. 检查 Supabase 认证日志（Logs → Auth）
2. 验证浏览器 Cookie 已启用
3. 尝试清除浏览器缓存
4. 访问 `/auth/debug` 检查会话状态

## 🔍 监控和调试

### 查看生产日志
```bash
# 流式查看日志
vercel logs --follow <project-name>

# 查看最近的构建
vercel logs <project-name> --limit 100
```

### Supabase 日志
1. 打开 [Supabase Dashboard](https://app.supabase.com)
2. 选择项目 → **Logs** → **Auth**
3. 查找相关错误

### 性能监控
- 访问 Vercel 项目 → **Analytics**
- 查看页面加载时间和错误率

## 📋 部署检查清单

在生产部署前：

- [ ] 本地测试完全成功
- [ ] 代码已提交到 GitHub
- [ ] Vercel 环境变量已设置
- [ ] GitHub OAuth 回调 URL 已更新
- [ ] Supabase 回调 URL 已更新
- [ ] `vercel.json` 配置正确
- [ ] 没有 TypeScript 错误
- [ ] 构建成功完成

部署后验证：

- [ ] 访问应用首页能加载
- [ ] 登录页面正常显示
- [ ] GitHub 登录按钮可点击
- [ ] OAuth 流程完整工作
- [ ] 能进入仪表板
- [ ] 显示用户信息
- [ ] 退出登录功能正常
- [ ] 调试页面显示正确的会话信息

## 🚨 生产故障排查

如果生产环境出现问题：

### 1. 快速回滚
```bash
# 查看部署历史
vercel list <project-name>

# 回滚到之前的版本
vercel rollback
```

### 2. 检查日志
```bash
# 查看最新错误
vercel logs <project-name>

# 查看特定时间范围
vercel logs <project-name> --since 2024-01-15 --until 2024-01-16
```

### 3. 手动修复和重新部署
```bash
git add .
git commit -m "Production hotfix: <description>"
git push origin main
```

## 💡 性能优化建议

部署后，考虑这些优化：

1. **启用 CDN** - 在 Vercel 中自动启用
2. **启用缓存** - 配置 `Cache-Control` 头
3. **启用压缩** - Vercel 自动启用
4. **监控性能** - 使用 Vercel Analytics

## 📚 更多资源

- [Vercel 部署指南](https://vercel.com/docs)
- [Next.js 部署最佳实践](https://nextjs.org/learn/foundations/how-nextjs-works/deployment)
- [Supabase 部署注意事项](https://supabase.com/docs/guides/hosting/overview)
- [OAuth 安全最佳实践](https://tools.ietf.org/html/rfc6749)

---

**部署完成后，你的 GitHub OAuth 登录应该在生产环境中完全工作！**
