# Vercel 部署指南

## 🚀 部署步骤

### 方法 1：通过 GitHub 集成（推荐）

1. **访问 Vercel Dashboard**
   - 打开 https://vercel.com/dashboard

2. **导入项目**
   - 点击 "Add New" > "Project"
   - 选择 "Import Git Repository"
   - 搜索并选择 `rain22324/nextjs-login` 仓库

3. **配置环境变量**
   - 在 "Environment Variables" 部分添加：
     - `NEXT_PUBLIC_SUPABASE_URL`: `https://escszoyuqevszvppkccb.supabase.co`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: 你的 Supabase 匿名密钥

4. **部署**
   - 点击 "Deploy"
   - 等待部署完成

### 方法 2：使用 Vercel CLI（命令行）

```bash
# 1. 登录 Vercel
vercel login

# 2. 链接项目
vercel link

# 3. 部署到生产环境
vercel deploy --prod
```

## 📋 环境变量设置

在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 值 | 说明 |
|-------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://escszoyuqevszvppkccb.supabase.co` | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase 匿名公钥 |

## 🔗 部署后的配置

### 更新 Supabase 回调 URL

在 Supabase 项目设置中，将以下 URL 添加到允许的重定向 URL：

- `https://your-vercel-deployment.vercel.app/auth/callback`

例如：
- `https://nextjs-login.vercel.app/auth/callback`

### Vercel 部署 URL

部署完成后，你将获得一个类似的 URL：
- 生产环境：`https://nextjs-login.vercel.app`
- 预览环境：`https://nextjs-login-[branch-name].vercel.app`

## ✅ 部署验证

1. 访问部署的 URL
2. 测试登录功能
3. 检查邮件验证是否正常
4. 确认仪表板页面可以访问

## 🔧 故障排除

### 构建失败
- 检查 `package.json` 中的依赖是否正确
- 验证环境变量是否已正确设置

### 运行时错误
- 检查 Supabase 凭证是否正确
- 查看 Vercel 的 Function Logs

### 邮件验证失败
- 确保 Supabase 的重定向 URL 已更新
- 检查 Supabase SMTP 配置

## 📚 更多资源

- [Vercel Next.js 部署文档](https://vercel.com/docs/frameworks/nextjs)
- [Supabase 部署指南](https://supabase.com/docs/guides/hosting/deploy)

