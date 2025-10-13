# Vercel 部署指南

## 概述

本项目使用 GitLab CI/CD 自动构建并部署到 Vercel。工作流程：

```
GitLab (代码推送) → GitLab Runner (构建) → Vercel (部署)
```

## 前置准备

### 1. Vercel 账号设置

1. 访问 [Vercel](https://vercel.com/) 并创建账号
2. 创建新项目或选择现有项目
3. 获取以下信息：

#### 获取 Vercel Token

1. 访问 [Vercel Tokens](https://vercel.com/account/tokens)
2. 点击 "Create Token"
3. 命名为 `gitlab-ci-turnitin-checker`
4. 设置过期时间（建议选择 No Expiration）
5. 复制生成的 Token（只显示一次，请妥善保存）

#### 获取 Vercel Project ID 和 Org ID

方法 1：从 Vercel Dashboard
1. 进入你的项目设置页面
2. Project ID 在 Settings → General → Project ID
3. Org ID 在 Settings → General → Team ID (如果是个人账号则为 User ID)

方法 2：使用 Vercel CLI
```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 在项目目录下运行
vercel link

# 查看 .vercel/project.json 文件
cat .vercel/project.json
```

### 2. GitLab CI/CD 变量配置

在 GitLab 项目中，导航到 **Settings → CI/CD → Variables**，添加以下变量：

| 变量名 | 值 | Protected | Masked |
|--------|-----|-----------|---------|
| `VERCEL_TOKEN` | 你的 Vercel Token | ✅ | ✅ |
| `VERCEL_ORG_ID` | 你的 Vercel Org/Team ID | ✅ | ❌ |
| `VERCEL_PROJECT_ID` | 你的 Vercel Project ID | ✅ | ❌ |

#### 环境变量（在 Vercel Dashboard 中配置）

在 Vercel 项目设置中（Settings → Environment Variables），添加以下环境变量：

> **详细配置说明:** 参见 [环境变量管理指南](./ENV_MANAGEMENT.md)

**Production 环境:**
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_PREFIX=https://api.answer-ai.com
NEXT_PUBLIC_API_BASE_URL=https://api.answer-ai.com/api/v1
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_CLARITY_PROJECT_ID=your_clarity_id
NEXT_PUBLIC_ENVIRONMENT=production
```

**Preview 环境:**
```
# 使用不同的测试环境配置（推荐）
NEXT_PUBLIC_SUPABASE_URL=your_preview_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_preview_anon_key
NEXT_PUBLIC_PREFIX=https://api-test.answer-ai.com
NEXT_PUBLIC_API_BASE_URL=https://api-test.answer-ai.com/api/v1
NEXT_PUBLIC_POSTHOG_KEY=your_preview_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_CLARITY_PROJECT_ID=your_preview_clarity_id
NEXT_PUBLIC_ENVIRONMENT=preview
```

## 部署流程

### 自动部署

#### 部署到 Production

```bash
# 推送到 master 分支
git add .
git commit -m "feat: your feature"
git push origin master
```

GitLab CI/CD 将自动：
1. ✅ 构建项目
2. ✅ 运行测试
3. ✅ 部署到 Vercel Production

#### 部署到 Preview (Test)

```bash
# 推送到 test 分支
git add .
git commit -m "feat: your feature"
git push origin test
```

GitLab CI/CD 将自动：
1. ✅ 构建项目
2. ✅ 部署到 Vercel Preview

### 手动部署（本地）

如果需要从本地直接部署到 Vercel：

```bash
# 安装 Vercel CLI（如果还没有）
npm install -g vercel

# 登录到 Vercel
vercel login

# 部署到 Preview
vercel

# 部署到 Production
vercel --prod
```

## CI/CD Pipeline 说明

### Build Stage

```yaml
- pnpm install --frozen-lockfile
- pnpm run build
```

- 使用 pnpm 安装依赖
- 构建 Next.js 应用
- 生成构建产物缓存

### Deploy Stage

#### Production 部署
```yaml
- vercel pull --yes --environment=production --token=$VERCEL_TOKEN
- vercel build --prod --token=$VERCEL_TOKEN
- vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN
```

#### Preview 部署
```yaml
- vercel pull --yes --environment=preview --token=$VERCEL_TOKEN
- vercel build --token=$VERCEL_TOKEN
- vercel deploy --prebuilt --token=$VERCEL_TOKEN
```

## Vercel 项目配置

### vercel.json

项目包含 `vercel.json` 配置文件，主要配置：

```json
{
  "buildCommand": "pnpm run build",
  "devCommand": "pnpm run dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["sin1"],  // 新加坡区域，靠近亚洲用户
  "headers": [...]       // 安全头部配置
}
```

### 区域配置

当前配置使用新加坡（sin1）区域，适合亚洲用户访问。

其他可用区域：
- `sin1` - Singapore (亚太)
- `hnd1` - Tokyo (日本)
- `iad1` - Washington, D.C. (美国东部)
- `sfo1` - San Francisco (美国西部)
- `fra1` - Frankfurt (欧洲)

修改 `vercel.json` 中的 `regions` 字段可更改部署区域。

## Supabase 配置

### 更新重定向 URL

在 Supabase Dashboard 中（Authentication → URL Configuration），添加 Vercel 域名：

**Site URL:**
```
https://your-project.vercel.app
```

**Redirect URLs:**
```
https://your-project.vercel.app/auth/callback
https://your-project-*.vercel.app/auth/callback  (用于 Preview 部署)
```

对于自定义域名：
```
https://yourdomain.com/auth/callback
```

## 监控和日志

### Vercel Dashboard

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 查看部署状态和日志

### GitLab CI/CD

1. 在 GitLab 项目中，导航到 **CI/CD → Pipelines**
2. 点击具体的 Pipeline 查看详细日志
3. 查看 Build 和 Deploy 阶段的输出

### 实时日志

```bash
# 查看 Production 日志
vercel logs your-project.vercel.app

# 查看特定部署的日志
vercel logs [deployment-url]
```

## 自定义域名

### 在 Vercel 中添加自定义域名

1. 进入项目 Settings → Domains
2. 添加你的域名（例如：`turnitin.yourdomain.com`）
3. 根据提示配置 DNS 记录

#### DNS 配置示例

**CNAME 记录:**
```
turnitin  CNAME  cname.vercel-dns.com.
```

**A 记录（如果使用根域名）:**
```
@  A  76.76.21.21
```

### 更新 Supabase 重定向 URL

域名添加后，记得在 Supabase 中添加新的重定向 URL：
```
https://turnitin.yourdomain.com/auth/callback
```

## 环境管理

### Production

- **分支:** `master`
- **URL:** `https://your-project.vercel.app`
- **自动部署:** 是
- **触发条件:** 推送到 `master` 分支

### Preview (Test)

- **分支:** `test`
- **URL:** `https://your-project-*.vercel.app` (每次部署生成唯一 URL)
- **自动部署:** 是
- **触发条件:** 推送到 `test` 分支

## 回滚策略

### 在 Vercel Dashboard 中回滚

1. 访问 Vercel Dashboard → 选择项目
2. 进入 Deployments 页面
3. 找到之前的成功部署
4. 点击三个点菜单 → "Promote to Production"

### 使用 Git 回滚

```bash
# 回滚到上一个提交
git revert HEAD
git push origin master

# 或者强制回滚到特定提交（谨慎使用）
git reset --hard <commit-hash>
git push origin master --force
```

## 性能优化

### Edge Functions

Vercel 自动将 Next.js API Routes 部署为 Edge Functions，提供：
- ⚡ 低延迟响应
- 🌍 全球分发
- 🚀 自动扩展

### 图片优化

Next.js Image Optimization 在 Vercel 上自动启用：
- 自动响应式图片
- WebP 格式支持
- 延迟加载

### 缓存策略

Vercel 自动缓存静态资源：
- 静态文件：永久缓存
- API 路由：可配置缓存策略
- 页面：根据 Next.js 配置

## 故障排查

### 部署失败

#### 检查 GitLab CI/CD 日志
```bash
# 在 GitLab UI 中查看
CI/CD → Pipelines → [失败的 Pipeline] → [失败的 Job]
```

常见错误：
- ❌ `VERCEL_TOKEN` 未设置或已过期
- ❌ `VERCEL_PROJECT_ID` 或 `VERCEL_ORG_ID` 错误
- ❌ 构建失败（检查代码错误）
- ❌ 环境变量缺失

#### 检查 Vercel 日志
```bash
vercel logs your-project.vercel.app --since 1h
```

### 构建超时

如果构建时间过长，可以：

1. 优化依赖：移除不必要的包
2. 使用 `.vercelignore` 排除不需要的文件
3. 在 Vercel Dashboard 中增加构建超时时间（Pro 计划）

### 环境变量问题

```bash
# 在 Vercel CLI 中检查环境变量
vercel env ls

# 添加环境变量
vercel env add VARIABLE_NAME
```

### Supabase 构建错误

**错误信息:**
```
Error: @supabase/ssr: Your project's URL and API key are required to create a Supabase client!
```

**原因:** 在构建时（预渲染阶段）Supabase 环境变量不可用

**解决方案:**
1. ✅ 确保在 Vercel Dashboard → Settings → Environment Variables 中配置了：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. ✅ 项目代码已更新为在环境变量缺失时使用占位符值
3. ✅ 本地构建测试（不需要环境变量也能成功）：
   ```bash
   pnpm run build
   ```

**注意:** 构建时会显示警告信息，这是正常的。运行时会使用正确的环境变量。

### Supabase 认证问题

1. ✅ 检查 Redirect URLs 是否正确
2. ✅ 确认域名在 Site URL 中
3. ✅ 验证环境变量 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. ✅ 检查浏览器控制台错误

## 安全最佳实践

### 环境变量

- ✅ 永远不要在代码中硬编码敏感信息
- ✅ 使用 `NEXT_PUBLIC_*` 前缀暴露客户端变量
- ✅ 定期轮换 API keys 和 tokens
- ✅ 使用 GitLab Protected Variables

### 访问控制

- ✅ 限制 GitLab CI/CD 变量访问权限
- ✅ 使用 Vercel Team 管理项目访问
- ✅ 启用 2FA 认证

### Headers

vercel.json 已配置安全头部：
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## 成本估算

### Vercel 定价

**Hobby Plan (免费):**
- ✅ 个人项目
- ✅ 100 GB 带宽/月
- ✅ 无限部署
- ⚠️ 无商业使用

**Pro Plan ($20/月):**
- ✅ 商业使用
- ✅ 1 TB 带宽/月
- ✅ 优先支持
- ✅ 团队协作

**Enterprise:**
- 联系销售

### GitLab Runner

使用 GitLab 共享 Runner (免费) 或自托管 Runner。

## 有用的命令

```bash
# Vercel CLI 命令
vercel                    # 部署到 Preview
vercel --prod             # 部署到 Production
vercel ls                 # 列出部署
vercel logs [url]         # 查看日志
vercel env ls             # 列出环境变量
vercel domains ls         # 列出域名
vercel inspect [url]      # 检查部署详情
vercel rollback [url]     # 回滚部署

# GitLab CI/CD
git push origin master                  # 触发 Production 部署
git push origin test                    # 触发 Preview 部署
```

## 相关文档

- [环境变量管理指南](./ENV_MANAGEMENT.md) - Preview 和 Production 环境配置
- [部署检查清单](./DEPLOYMENT_CHECKLIST.md) - 部署前检查事项
- [项目 README](./README.md) - 项目总览
- [Vercel 文档](https://vercel.com/docs)
- [Vercel CLI 文档](https://vercel.com/docs/cli)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [GitLab CI/CD 文档](https://docs.gitlab.com/ee/ci/)

## 支持

遇到问题？

1. 查看 [Vercel Status](https://www.vercel-status.com/)
2. 访问 [Vercel 社区](https://github.com/vercel/vercel/discussions)
3. 联系团队技术负责人

---

**最后更新:** 2025-10-11
**版本:** 2.0.0

