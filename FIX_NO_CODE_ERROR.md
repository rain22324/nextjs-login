# 🚨 修复 `no_code` 错误 - 快速指南

## ❌ 错误原因

GitHub 没有返回授权码给你的应用 → 这是**回调 URL 配置问题**

## ✅ 解决方案 - 3 步修复

### Step 1️⃣: 打开 Supabase Dashboard

访问: [https://app.supabase.com](https://app.supabase.com)

### Step 2️⃣: 配置 GitHub Provider 的回调 URL

1. 选择你的项目
2. 左侧 → **Authentication** (认证)
3. 点击 **Providers** (提供商)
4. 找到 **GitHub**，点击编辑

**关键配置**：在 **Redirect URL** (重定向 URL) 字段输入：

```
http://192.168.1.102:3000/auth/callback
```

✅ 确保：
- 有 `http://` 前缀
- 使用你的 IP 地址（`192.168.1.102`）
- 包含端口号 `:3000`
- 以 `/auth/callback` 结尾

**保存**

### Step 3️⃣: 更新 GitHub OAuth 应用

打开: [https://github.com/settings/developers](https://github.com/settings/developers)

1. 找到你的 OAuth 应用
2. 点击编辑
3. 在 **Authorization callback URL** 输入相同的回调 URL：

```
http://192.168.1.102:3000/auth/callback
```

✅ 必须完全相同

**保存**

---

## 🧪 测试修复

完成上述配置后：

1. 访问 `http://192.168.1.102:3000`
2. 点击"使用 GitHub 登录"
3. 在 GitHub 授权
4. **应该**能进入仪表板
5. **不应该**看到 `no_code` 错误

---

## 🔍 验证配置

### 两个 URL 必须完全相同：

**Supabase 中的**:
```
http://192.168.1.102:3000/auth/callback
```

**GitHub 中的**:
```
http://192.168.1.102:3000/auth/callback
```

❌ **如果不同**，会导致 `no_code` 错误！

---

## 💡 常见错误

| 错误 | 原因 |
|------|------|
| `http://localhost:3000/auth/callback` | 应该用 IP，不是 localhost |
| `http://192.168.1.102/auth/callback` | 缺少端口号 `:3000` |
| `192.168.1.102:3000/auth/callback` | 缺少 `http://` 前缀 |
| `https://192.168.1.102:3000/auth/callback` | 应该是 `http://`（本地开发） |

---

## ✨ 成功标志

✅ 点击"使用 GitHub 登录"  
✅ 重定向到 GitHub 授权页面  
✅ 授权并重定向回你的应用  
✅ 进入仪表板  
✅ 看到你的 GitHub 邮箱和 ID

---

## 🆘 如果还是不工作

1. **清除浏览器缓存**
   - F12 → Application → Clear Storage

2. **检查浏览器网络请求**
   - F12 → Network 标签
   - 点击登录，查看最后的重定向 URL
   - 应该看到 `code=xxxxx` 参数

3. **查看浏览器控制台**
   - F12 → Console
   - 是否有红色错误？

4. **查看服务器日志**
   - 开发服务器窗口会打印：
   - `[auth/callback] Full URL: ...`
   - 查看是否有 `code` 参数

---

**配置正确后，`no_code` 错误会消失！** 🎉
