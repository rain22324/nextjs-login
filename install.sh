#!/bin/bash

# Next.js + Supabase 登录系统 - 安装脚本

echo "======================================"
echo "Next.js + Supabase 用户登录系统"
echo "======================================"
echo ""

# 检查 Node.js
echo "检查 Node.js 版本..."
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，请先安装 Node.js >= 20.9.0"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✓ Node.js 版本: $NODE_VERSION"
echo ""

# 安装依赖
echo "安装 npm 依赖..."
npm install
echo "✓ 依赖安装完成"
echo ""

# 检查环境变量
echo "检查环境变量配置..."
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local 文件不存在"
    echo "请创建 .env.local 文件并填入以下内容："
    echo ""
    echo "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key"
    echo ""
else
    echo "✓ .env.local 文件已存在"
fi
echo ""

# 提示启动开发服务器
echo "======================================"
echo "安装完成！"
echo "======================================"
echo ""
echo "下一步，运行以下命令启动开发服务器："
echo ""
echo "  npm run dev"
echo ""
echo "然后访问 http://localhost:3000"
echo ""
echo "更多信息，请参考 QUICKSTART.md 和 PROJECT_README.md"
