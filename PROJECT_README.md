# Next.js + Supabase 用户登录项目

这是一个使用 Next.js 和 Supabase 实现的用户登录系统。

## 功能特性

- ✅ 用户注册
- ✅ 用户登录
- ✅ 邮箱验证
- ✅ 用户会话管理
- ✅ 受保护的仪表板页面
- ✅ 用户退出登录

## 项目结构

```
├── app/
│   ├── page.tsx              # 主页（登录页面）
│   ├── dashboard/
│   │   └── page.tsx          # 用户仪表板
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts      # Supabase 认证回调
│   ├── layout.tsx            # 应用程序布局
│   └── globals.css           # 全局样式
├── components/
│   └── LoginForm.tsx         # 登录表单组件
├── lib/
│   └── supabase.ts           # Supabase 客户端配置
├── .env.local                # 环境变量配置
└── package.json              # 项目依赖
```

## 前置要求

- Node.js >= 18
- npm 或 yarn
- Supabase 账户

## 安装步骤

### 1. 克隆或进入项目

```bash
cd nextjs-login
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置 Supabase

1. 访问 [Supabase](https://supabase.com) 并创建新项目
2. 获取你的项目 URL 和公钥（anon key）
3. 在项目根目录创建或编辑 `.env.local` 文件

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. 运行开发服务器

```bash
npm run dev
```

应用程序将在 [http://localhost:3000](http://localhost:3000) 启动

## 使用说明

### 注册新用户

1. 在登录页面点击"注册"按钮
2. 输入邮箱和密码
3. 检查您的邮件收箱以验证账户
4. 验证后可以使用账户登录

### 登录

1. 在登录页面输入已注册的邮箱和密码
2. 点击"登录"按钮
3. 成功登录后，您将被重定向到仪表板

### 管理会话

- 登录后的用户信息会自动保存在会话中
- 仪表板页面受保护，未登录用户会被重定向回登录页面
- 点击"退出登录"按钮可以注销账户

## 技术栈

- **前端框架**: Next.js 16 (App Router)
- **认证**: Supabase Auth
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **数据库**: PostgreSQL (通过 Supabase)

## 文件说明

### `lib/supabase.ts`

Supabase 客户端初始化。从环境变量读取 URL 和密钥。

### `components/LoginForm.tsx`

登录表单组件，包含：
- 邮箱和密码输入
- 登录和注册功能
- 错误和成功消息显示
- 加载状态管理

### `app/page.tsx`

主页面，显示登录表单。

### `app/dashboard/page.tsx`

受保护的仪表板页面，显示：
- 当前登录用户的邮箱
- 用户 ID
- 退出登录选项

### `app/auth/callback/route.ts`

处理 Supabase 邮箱验证回调的 API 路由。

## 环境变量

- `NEXT_PUBLIC_SUPABASE_URL` - 您的 Supabase 项目 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - 您的 Supabase 公钥

## 常见问题

### 为什么无法登录？

- 确保环境变量配置正确
- 检查用户在 Supabase 中是否已创建
- 确保用户邮箱已通过验证

### 如何重置密码？

当前版本不包含密码重置功能。您可以在 Supabase 仪表板中手动管理用户。

### 会话会过期吗？

Supabase 会话默认有效期为 1 小时。您可以在 Supabase 项目设置中配置此项。

## 部署

### 部署到 Vercel

1. 将项目推送到 GitHub
2. 在 [Vercel](https://vercel.com) 上连接您的仓库
3. 在 Vercel 项目设置中添加环境变量
4. 部署完成

## 许可证

此项目采用 MIT 许可证。

## 下一步

可以考虑添加以下功能：
- 密码重置功能
- 社交登录（Google、GitHub 等）
- 用户个人资料编辑
- 两步验证
- 记住我功能
