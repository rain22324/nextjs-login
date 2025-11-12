@echo off
REM Next.js + Supabase 登录系统 - Windows 安装脚本

echo ======================================
echo Next.js + Supabase 用户登录系统
echo ======================================
echo.

REM 检查 Node.js
echo 检查 Node.js 版本...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo. 未找到 Node.js，请先安装 Node.js 20.9.0 或更高版本
    echo. 访问 https://nodejs.org 下载安装
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo. Node.js 版本: %NODE_VERSION%
echo.

REM 安装依赖
echo 安装 npm 依赖...
call npm install
if %ERRORLEVEL% neq 0 (
    echo. npm 安装失败
    pause
    exit /b 1
)
echo. 依赖安装完成
echo.

REM 检查环境变量
echo 检查环境变量配置...
if not exist .env.local (
    echo. .env.local 文件不存在
    echo. 请创建 .env.local 文件并填入以下内容：
    echo.
    echo. NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    echo. NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    echo.
) else (
    echo. .env.local 文件已存在
)
echo.

REM 提示启动开发服务器
echo ======================================
echo 安装完成！
echo ======================================
echo.
echo 下一步，运行以下命令启动开发服务器：
echo.
echo   npm run dev
echo.
echo 然后访问 http://localhost:3000
echo.
echo 更多信息，请参考 QUICKSTART.md 和 PROJECT_README.md
echo.
pause
