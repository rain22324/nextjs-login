# Next.js + Supabase GitHub OAuth 登录系统

一个完整的身份认证系统，集成了 GitHub OAuth 登录和 Supabase 后端。

## ✨ 项目特性

- 🔐 **GitHub OAuth 登录** - 安全的社交登录
- 📧 **邮箱/密码认证** - 传统账户系统
- 💾 **会话管理** - 自动保存和续期
- 🎨 **现代 UI** - 使用 Tailwind CSS
- 📱 **响应式设计** - 支持移动设备
- 🚀 **已部署** - 可直接部署到 Vercel

## 🚀 快速开始

### 1️⃣ 安装依赖
```bash
npm install
```

### 2️⃣ 配置环境变量

创建 `.env.local` 文件：
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3️⃣ 启动开发服务器
```bash
npm run dev
```

访问 `http://localhost:3000` 查看应用。

## 📚 完整文档

### 🔰 新手入门

最快了解项目的方式：

1. **[START_HERE.md](./START_HERE.md)** ⭐ - **从这里开始！**
   - 项目概述
   - 3 步快速启动
   - 基本测试

2. **[QUICKSTART.md](./QUICKSTART.md)** - 5 分钟快速开始
   - 详细的环境配置
   - 依赖安装步骤

3. **[TESTING.md](./TESTING.md)** - 测试指南
   - 功能测试方法
   - 浏览器调试技巧

### 🎯 按需求查找

#### ✨ GitHub OAuth 问题（最新更新）
→ 查看 **[GITHUB_OAUTH_FIX.md](./GITHUB_OAUTH_FIX.md)** - 完整的 OAuth 修复指南（按 Supabase 官方标准）

#### 🧪 测试和诊断 OAuth
→ 查看 **[OAUTH_TESTING_GUIDE.md](./OAUTH_TESTING_GUIDE.md)** - 详细的测试步骤和问题排查

#### 📊 OAuth 实现细节
→ 查看 **[OAUTH_IMPLEMENTATION_SUMMARY.md](./OAUTH_IMPLEMENTATION_SUMMARY.md)** - 实现总结和对官方标准的对照

#### 遇到 `no_code` 错误？
→ 查看 **[FIX_NO_CODE_ERROR.md](./FIX_NO_CODE_ERROR.md)** - 快速修复指南

#### 想要部署到生产？
→ 查看 **[VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)** - 完整部署步骤

#### 想要深入理解实现？
→ 查看 **[OAUTH_SESSION_FIX.md](./OAUTH_SESSION_FIX.md)** - 技术细节

#### 需要快速参考？
→ 查看 **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - 命令和常见问题

### 📖 完整文档导航

→ 查看 **[docs/INDEX.md](./docs/INDEX.md)** - 所有文档的完整索引和分类

## 🏗️ 项目结构

```
nextjs-login/
├── app/
│   ├── auth/
│   │   ├── callback/           # OAuth 回调处理
│   │   ├── debug/              # 调试工具
│   │   └── auth-code-error/    # 错误页面
│   ├── dashboard/              # 用户仪表板
│   └── page.tsx                # 首页登录
├── components/
│   └── LoginForm.tsx           # 登录表单组件
├── lib/
│   └── supabase.ts             # Supabase 客户端配置
└── docs/                        # 详细文档
```

## 🔑 关键功能

### GitHub OAuth
- 集成 GitHub 社交登录
- 自动会话管理
- 安全的授权码交换

### 认证管理
- 实时会话监听
- 自动令牌续期
- 浏览器存储持久化

### 用户体验
- 详细的错误提示
- 调试工具页面
- 清晰的用户界面

## 🛠️ 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 运行 ESLint
npm run lint
```

## 📋 配置清单

确保在使用前完成以下配置：

- [ ] 创建 `.env.local` 文件
- [ ] 配置 Supabase URL 和 Anon Key
- [ ] 在 Supabase 中启用 GitHub Provider
- [ ] 配置 GitHub OAuth 应用回调 URL
- [ ] 验证回调 URL 完全匹配

## 🔧 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 16.0 | React 框架 |
| React | 19 | UI 库 |
| TypeScript | 5 | 类型检查 |
| Supabase | 2.81 | 后端即服务 |
| Tailwind CSS | 4 | 样式 |

## 📱 浏览器支持

✅ Chrome  
✅ Firefox  
✅ Safari  
✅ Edge  
✅ 移动浏览器

## 🚀 部署

### Vercel（推荐）

```bash
# 最简单的部署方式
git push origin main
# Vercel 会自动检测并部署
```

详细步骤：[VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

### 自定义服务器

```bash
npm run build
npm start
```

## 🐛 常见问题

### Q: 看到 `no_code` 错误怎么办？
A: 这是回调 URL 配置问题。查看 [FIX_NO_CODE_ERROR.md](./FIX_NO_CODE_ERROR.md)

### Q: 如何验证 GitHub OAuth 配置？
A: 参考 [GITHUB_CALLBACK_URL_FIX.md](./GITHUB_CALLBACK_URL_FIX.md) 中的检查清单

### Q: 本地如何测试 OAuth？
A: 使用你的本地 IP 和端口 3000，例如 `http://192.168.1.102:3000`

### Q: 如何查看会话信息？
A: 访问 `/auth/debug` 页面查看调试信息

更多问题：查看 [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

## 📊 项目状态

| 项目 | 状态 |
|------|------|
| 构建 | ✅ 成功 |
| 测试 | ✅ 通过 |
| OAuth | ✅ 工作中 |
| 会话管理 | ✅ 正常 |
| 部署 | ✅ 就绪 |

## 📞 获取帮助

1. **快速问题** → 查看 [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
2. **具体错误** → 使用 `/auth/debug` 页面诊断
3. **详细文档** → 查看 [docs/INDEX.md](./docs/INDEX.md)
4. **部署问题** → 查看 [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

## 📄 许可证

MIT

## 🙏 致谢

- [Next.js](https://nextjs.org) - React 框架
- [Supabase](https://supabase.com) - 开源后端
- [Tailwind CSS](https://tailwindcss.com) - 工具类 CSS
- [Vercel](https://vercel.com) - 部署平台

---

## 🎯 下一步

1. **新手？** → 阅读 [START_HERE.md](./START_HERE.md)
2. **准备好了？** → 按照 [QUICKSTART.md](./QUICKSTART.md) 操作
3. **遇到问题？** → 查看 [docs/INDEX.md](./docs/INDEX.md) 中的问题排查
4. **想要部署？** → 阅读 [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

---

**祝你使用愉快！** 🚀

有问题？查看 [docs/INDEX.md](./docs/INDEX.md) 获取完整文档导航。
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
