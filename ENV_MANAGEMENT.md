# 环境变量管理指南

## 概述

本项目使用两套环境变量配置：
- **Preview (Test)**: 用于 `test` 分支，测试环境
- **Production**: 用于 `master` 分支，生产环境

## 环境变量配置位置

### 本地开发
使用 `.env.local` 文件（已在 `.gitignore` 中）

### Vercel 部署
在 Vercel Dashboard → Settings → Environment Variables 中配置

## Preview 环境变量模板

创建文件：`.env.preview`

```env
# API Configuration (Preview/Test)
NEXT_PUBLIC_PREFIX=https://api-test.answer-ai.com
NEXT_PUBLIC_API_BASE_URL=https://api-test.answer-ai.com/api/v1

# Supabase Configuration (Preview/Test)
NEXT_PUBLIC_SUPABASE_URL=https://your-preview-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxPreviewKeyxxx

# PostHog Analytics (Preview - 可选)
NEXT_PUBLIC_POSTHOG_KEY=phc_preview_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Microsoft Clarity (Preview - 可选)
NEXT_PUBLIC_CLARITY_PROJECT_ID=preview_clarity_id

# Environment Identifier
NEXT_PUBLIC_ENVIRONMENT=preview
```

## Production 环境变量模板

创建文件：`.env.production`

```env
# API Configuration (Production)
NEXT_PUBLIC_PREFIX=https://api.answer-ai.com
NEXT_PUBLIC_API_BASE_URL=https://api.answer-ai.com/api/v1

# Supabase Configuration (Production)
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxProductionKeyxxx

# PostHog Analytics (Production)
NEXT_PUBLIC_POSTHOG_KEY=phc_production_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Microsoft Clarity (Production)
NEXT_PUBLIC_CLARITY_PROJECT_ID=production_clarity_id

# Environment Identifier
NEXT_PUBLIC_ENVIRONMENT=production
```

## 在 Vercel 中配置环境变量

### 方法 1: 通过 Vercel Dashboard (推荐)

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择项目 `turnitin-checker`
3. 进入 **Settings → Environment Variables**
4. 为每个环境添加变量

#### Preview 环境配置

点击 **Add New** 并选择 **Preview**:

| 变量名 | 值 (Preview) | 环境 |
|--------|-------------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx-preview.supabase.co` | Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `preview-anon-key` | Preview |
| `NEXT_PUBLIC_PREFIX` | `https://api-test.answer-ai.com` | Preview |
| `NEXT_PUBLIC_API_BASE_URL` | `https://api-test.answer-ai.com/api/v1` | Preview |
| `NEXT_PUBLIC_POSTHOG_KEY` | `phc_preview_xxx` | Preview |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://app.posthog.com` | Preview |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | `preview_clarity_id` | Preview |
| `NEXT_PUBLIC_ENVIRONMENT` | `preview` | Preview |

#### Production 环境配置

点击 **Add New** 并选择 **Production**:

| 变量名 | 值 (Production) | 环境 |
|--------|----------------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx-prod.supabase.co` | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `production-anon-key` | Production |
| `NEXT_PUBLIC_PREFIX` | `https://api.answer-ai.com` | Production |
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.answer-ai.com/api/v1` | Production |
| `NEXT_PUBLIC_POSTHOG_KEY` | `phc_production_xxx` | Production |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://app.posthog.com` | Production |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | `production_clarity_id` | Production |
| `NEXT_PUBLIC_ENVIRONMENT` | `production` | Production |

### 方法 2: 使用 Vercel CLI

#### 批量导入 Preview 环境变量

```bash
# 从 .env.preview 文件导入到 Vercel Preview 环境
vercel env pull .env.preview.local preview
vercel env add < .env.preview --environment preview
```

#### 批量导入 Production 环境变量

```bash
# 从 .env.production 文件导入到 Vercel Production 环境
vercel env pull .env.production.local production
vercel env add < .env.production --environment production
```

#### 查看已配置的环境变量

```bash
# 列出所有环境变量
vercel env ls

# 拉取环境变量到本地
vercel env pull .env.local
```

## 本地开发环境变量

### 使用 .env.local (推荐)

创建 `.env.local` 文件用于本地开发：

```bash
# 复制 preview 或 production 配置
cp .env.preview .env.local
# 或
cp .env.production .env.local

# 编辑 .env.local 填入实际值
```

### 或使用 Vercel CLI 拉取

```bash
# 从 Vercel Preview 拉取
vercel env pull .env.local --environment=preview

# 或从 Vercel Production 拉取
vercel env pull .env.local --environment=production
```

## 环境变量说明

### 必需变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | `eyJhbGc...` |
| `NEXT_PUBLIC_PREFIX` | API 前缀 | `https://api.answer-ai.com` |
| `NEXT_PUBLIC_API_BASE_URL` | API 基础 URL | `https://api.answer-ai.com/api/v1` |

### 可选变量（分析工具）

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog 项目密钥 | `phc_xxx` |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog 主机 | `https://app.posthog.com` |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity ID | `abc123` |
| `NEXT_PUBLIC_ENVIRONMENT` | 环境标识 | `preview` / `production` |

## 环境变量验证

### 创建验证脚本

创建 `scripts/verify-env.js`:

```javascript
#!/usr/bin/env node

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_PREFIX',
  'NEXT_PUBLIC_API_BASE_URL',
];

const optionalEnvVars = [
  'NEXT_PUBLIC_POSTHOG_KEY',
  'NEXT_PUBLIC_POSTHOG_HOST',
  'NEXT_PUBLIC_CLARITY_PROJECT_ID',
  'NEXT_PUBLIC_ENVIRONMENT',
];

console.log('🔍 验证环境变量...\n');

let hasError = false;

// 检查必需变量
console.log('📋 必需变量:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`  ❌ ${varName}: 未设置`);
    hasError = true;
  } else {
    const maskedValue = value.length > 20 
      ? value.substring(0, 20) + '...' 
      : value;
    console.log(`  ✅ ${varName}: ${maskedValue}`);
  }
});

// 检查可选变量
console.log('\n📋 可选变量:');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`  ⚠️  ${varName}: 未设置 (可选)`);
  } else {
    const maskedValue = varName.includes('KEY') && value.length > 20
      ? value.substring(0, 20) + '...'
      : value;
    console.log(`  ✅ ${varName}: ${maskedValue}`);
  }
});

if (hasError) {
  console.log('\n❌ 验证失败：缺少必需的环境变量');
  process.exit(1);
} else {
  console.log('\n✅ 验证通过：所有必需的环境变量已设置');
  process.exit(0);
}
```

### 运行验证

```bash
# 添加执行权限
chmod +x scripts/verify-env.js

# 验证环境变量
node scripts/verify-env.js

# 或在 package.json 中添加脚本
# "verify-env": "node scripts/verify-env.js"
pnpm run verify-env
```

## 最佳实践

### 1. 环境隔离

✅ **推荐做法:**
- Preview 和 Production 使用完全独立的 Supabase 项目
- Preview 和 Production 使用不同的 API 端点（如果可能）
- 使用不同的分析工具项目（PostHog, Clarity）

❌ **避免:**
- 在测试环境使用生产数据库
- 混用环境配置

### 2. 密钥安全

✅ **推荐做法:**
- 永远不要将真实的环境变量提交到 Git
- 使用强密钥和定期轮换
- 在 Vercel 中标记敏感变量为 Sensitive

❌ **避免:**
- 在代码中硬编码密钥
- 在公共仓库中暴露密钥
- 与团队成员通过不安全渠道分享密钥

### 3. 文档维护

✅ **推荐做法:**
- 保持此文档更新
- 添加新环境变量时更新模板
- 记录每个变量的用途

### 4. 团队协作

✅ **推荐做法:**
- 使用 Vercel Team 管理访问权限
- 在团队内部使用密码管理器（如 1Password, LastPass）
- 新成员入职时提供环境变量设置指南

## 快速参考

### 使用脚本快速创建环境文件模板

项目提供了便捷的脚本来创建环境变量模板：

```bash
# 运行环境变量模板创建脚本
./scripts/create-env-template.sh

# 或使用 bash 运行
bash scripts/create-env-template.sh
```

脚本会提供交互式菜单，可以选择创建：
- `.env.local` - 本地开发环境
- `.env.preview` - Preview 环境（参考）
- `.env.production` - Production 环境（参考）
- 或全部创建

### 手动创建本地环境文件

```bash
# 创建 .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
NEXT_PUBLIC_PREFIX=https://api.answer-ai.com
NEXT_PUBLIC_API_BASE_URL=https://api.answer-ai.com/api/v1
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_CLARITY_PROJECT_ID=your_clarity_id
NEXT_PUBLIC_ENVIRONMENT=development
EOF
```

### 从 Vercel 拉取环境变量

```bash
# 拉取 Preview 环境变量
vercel env pull .env.preview --environment=preview

# 拉取 Production 环境变量
vercel env pull .env.production --environment=production
```

### 部署时环境变量生效

- `test` 分支 → 使用 Preview 环境变量
- `master` 分支 → 使用 Production 环境变量

## 故障排查

### 环境变量未生效

1. ✅ 检查 Vercel Dashboard 中是否正确配置
2. ✅ 确认环境选择正确（Preview vs Production）
3. ✅ 重新部署触发环境变量更新
4. ✅ 检查变量名称拼写是否正确

### 构建时环境变量未找到

1. ✅ 确保变量以 `NEXT_PUBLIC_` 开头（客户端可访问）
2. ✅ 在 Vercel 中配置，不要只在本地配置
3. ✅ 检查是否为正确的环境配置（Preview/Production）

### 验证环境变量

```bash
# 在 Vercel 部署中查看环境变量（部分）
# 在应用中添加调试页面或 API 路由
# 注意：不要暴露完整的密钥！

# 示例 API 路由 (pages/api/debug-env.ts)
export default function handler(req, res) {
  res.json({
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasPosthog: !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
  });
}
```

## 相关文档

- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)
- [Project README](./README.md)
- [Vercel Environment Variables 文档](https://vercel.com/docs/concepts/projects/environment-variables)

---

**最后更新:** 2025-10-11
**版本:** 1.0.0

