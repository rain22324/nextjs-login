# 快速启动指南

## 📋 项目概述

这是一个基于 **Next.js 16** 和 **Supabase** 的用户登录系统。实现了完整的认证流程，包括用户注册、登录、邮箱验证和会话管理。

## 🚀 快速开始

### 第一步：获取 Supabase 凭证

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 创建新项目（或使用现有项目）
3. 在项目设置中找到：
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 第二步：配置环境变量

编辑 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

### 配置社交登录（Google / GitHub）

要启用社交登录（OAuth），需要在 Supabase 和对应的 OAuth 提供商平台上都完成配置。

#### 步骤 1：获取 OAuth 凭证

**Google OAuth：**
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目（或使用现有项目）
3. 启用 Google+ API
4. 前往 "Credentials" 创建 "OAuth 2.0 Client ID"（应用类型：Web application）
5. 在 "Authorized redirect URIs" 添加：
   - 本地开发： `https://escszoyuqevszvppkccb.supabase.co/auth/v1/callback?provider=google`
   - 部署环境： `https://<your-supabase-url>/auth/v1/callback?provider=google`
6. 复制 `Client ID` 和 `Client Secret`

**GitHub OAuth：**
1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 "New OAuth App"
3. 填写应用名称和 Homepage URL
4. 在 "Authorization callback URL" 添加：
   - 本地开发： `https://escszoyuqevszvppkccb.supabase.co/auth/v1/callback?provider=github`
   - 部署环境： `https://<your-supabase-url>/auth/v1/callback?provider=github`
5. 复制 `Client ID` 和 `Client Secret`

#### 步骤 2：在 Supabase 中启用 OAuth

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目，进入 **Authentication** → **Providers**
3. **启用 Google：**
   - 点击 Google 提供商卡片
   - 将从 Google Cloud Console 复制的 `Client ID` 和 `Client Secret` 粘贴进去
   - 点击 "Save"
4. **启用 GitHub：**
   - 点击 GitHub 提供商卡片
   - 将从 GitHub Developer Settings 复制的 `Client ID` 和 `Client Secret` 粘贴进去
   - 点击 "Save"

#### 步骤 3：验证配置

1. 确保 `.env.local` 中的 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 已正确配置
2. 启动开发服务器并访问 http://localhost:3000
3. 点击 "使用 Google 登录" 或 "使用 GitHub 登录" 按钮进行测试

**常见问题：**
- 如收到 "Unsupported provider: provider is not enabled" 错误，说明 Supabase 中该提供商未启用，请检查第 2 步
- 如出现重定向 URI 不匹配错误，请确保各平台的回调 URL 与 Supabase 中的设置一致

#### 部署到生产环境

当部署到 Vercel/Netlify 时，确保在托管平台的环境变量/Secrets 中正确设置 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。OAuth 的 Client Secret 应存储在相应的 OAuth 提供商平台中，而非暴露在应用代码里。
```

### 第三步：安装依赖并运行

```bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 📁 项目结构详解

```
nextjs-login/
├── app/
│   ├── page.tsx                    # 主页 - 登录页面
│   ├── dashboard/
│   │   └── page.tsx                # 用户仪表板（受保护）
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts            # 邮箱验证回调
│   ├── layout.tsx                  # 根布局
│   └── globals.css                 # 全局样式
├── components/
│   └── LoginForm.tsx               # 登录/注册表单
├── lib/
│   └── supabase.ts                 # Supabase 客户端
├── public/                         # 静态资源
├── .env.local                      # 环境变量（本地）
├── package.json                    # 依赖配置
└── tsconfig.json                   # TypeScript 配置
```

## 🔐 认证流程

### 用户注册流程

```
用户输入邮箱和密码
         ↓
提交表单到 supabase.auth.signUp()
         ↓
Supabase 发送验证邮件
         ↓
用户点击邮件中的链接
         ↓
触发 /auth/callback 路由
         ↓
exchangeCodeForSession() 创建会话
         ↓
重定向到 /dashboard
```

### 用户登录流程

```
用户输入邮箱和密码
         ↓
提交表单到 supabase.auth.signInWithPassword()
         ↓
Supabase 验证凭证
         ↓
会话创建成功
         ↓
重定向到 /dashboard
```

## 📝 文件说明

### `lib/supabase.ts` - Supabase 客户端初始化

```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

初始化 Supabase 客户端以进行认证操作。

### `components/LoginForm.tsx` - 登录表单组件

主要功能：
- 邮箱和密码输入字段
- 登录按钮 - 调用 `signInWithPassword()`
- 注册按钮 - 调用 `signUp()` 并发送验证邮件
- 错误消息显示
- 加载状态管理

### `app/page.tsx` - 主页

展示登录表单的容器页面，使用 Tailwind CSS 样式。

### `app/dashboard/page.tsx` - 仪表板

保护的页面，显示：
- 当前用户邮箱
- 用户 ID
- 退出登录按钮

如果用户未登录，自动重定向到主页。

### `app/auth/callback/route.ts` - 认证回调

处理邮箱验证链接，通过 `exchangeCodeForSession()` 建立用户会话。

## 🛠 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 16.0.1 | React 框架 |
| React | 19 | UI 库 |
| TypeScript | - | 类型安全 |
| Tailwind CSS | - | 样式框架 |
| Supabase JS | 2.81.1 | 后端认证 |
| ESLint | - | 代码规范 |

## 🎨 UI 设计

- 响应式设计 - 适配所有设备
- 现代化的蓝色主题
- Tailwind CSS 实现
- 清晰的错误和成功提示
- 流畅的用户交互

## 🔑 关键代码示例

### 用户注册

```typescript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

### 用户登录

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

### 检查会话

```typescript
const { data: { session } } = await supabase.auth.getSession();
```

### 用户退出

```typescript
await supabase.auth.signOut();
```

## 🚀 部署指南

### 部署到 Vercel

1. 推送代码到 GitHub

```bash
git add .
git commit -m "Initial commit"
git push
```

2. 在 Vercel 导入项目
3. 添加环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 部署

### 部署到 Netlify

1. 构建应用

```bash
npm run build
```

2. 设置环境变量
3. 连接 Git 仓库并部署

## 🐛 常见问题

### Q: 点击社交登录按钮报错 "Unsupported provider: provider is not enabled"？
A: 这说明 Supabase 中还未启用该 OAuth 提供商。请按照"配置社交登录"部分的步骤 2，在 Supabase Dashboard 中启用相应提供商并填写 Client ID 和 Client Secret。

### Q: 收不到验证邮件？
A: 检查 Supabase 项目的邮件配置，或在仪表板中使用测试模式。

### Q: 登录后重定向失败？
A: 确保 `NEXT_PUBLIC_SUPABASE_URL` 和密钥正确配置。

### Q: 如何在本地测试邮件验证？
A: 使用 Supabase 的测试用户功能或查看邮件日志。

### Q: 如何延长会话时间？
A: 在 Supabase 项目设置 > JWT 配置中修改 `jwt_exp`。

## 📚 更多资源

- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [TypeScript 文档](https://www.typescriptlang.org/docs)

## 🤝 扩展功能建议

- [ ] 添加社交登录（Google、GitHub）
- [ ] 实现密码重置功能
- [ ] 添加用户个人资料编辑
- [ ] 实现两步验证
- [ ] 添加记住我功能
- [ ] 社交媒体分享
- [ ] 用户头像上传

## 📄 许可证

MIT

---

**祝您使用愉快！** 如有问题，请参考 Supabase 和 Next.js 官方文档。
