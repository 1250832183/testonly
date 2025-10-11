# Turnitin Checker - Vercel Deployment Checklist

> **注意:** 本项目已迁移到 Vercel 部署。使用 GitLab CI/CD 自动构建并推送到 Vercel。

## 📋 Pre-Deployment Checklist

### 1. Vercel 账号设置

- [ ] 创建 Vercel 账号
- [ ] 创建新项目或连接现有项目
- [ ] 获取 Vercel Token
- [ ] 获取 Vercel Project ID
- [ ] 获取 Vercel Org ID (Team ID)
- [ ] 保存这些凭证到安全位置

### 2. GitLab CI/CD 变量配置

- [ ] 在 GitLab Settings → CI/CD → Variables 添加变量：
  - [ ] `VERCEL_TOKEN` (Protected, Masked)
  - [ ] `VERCEL_ORG_ID` (Protected)
  - [ ] `VERCEL_PROJECT_ID` (Protected)
- [ ] 验证所有变量已正确设置

### 3. Vercel 环境变量配置

在 Vercel Dashboard → Settings → Environment Variables 添加：

#### Production 环境
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Set `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Set `NEXT_PUBLIC_PREFIX`
- [ ] Set `NEXT_PUBLIC_API_BASE_URL`
- [ ] Set `NEXT_PUBLIC_POSTHOG_KEY` (可选)
- [ ] Set `NEXT_PUBLIC_POSTHOG_HOST` (可选)
- [ ] Set `NEXT_PUBLIC_CLARITY_PROJECT_ID` (可选)

#### Preview 环境
- [ ] 复制 Production 环境变量
- [ ] 或配置独立的测试环境变量
- [ ] 验证所有环境变量正确

### 4. Supabase Setup

- [ ] Create Supabase project
- [ ] Enable Google OAuth provider
- [ ] Configure Google Cloud OAuth credentials
- [ ] Add authorized redirect URIs:
  - [ ] Development: `http://localhost:3000/auth/callback`
  - [ ] Vercel Production: `https://your-project.vercel.app/auth/callback`
  - [ ] Vercel Preview: `https://your-project-*.vercel.app/auth/callback`
  - [ ] Custom Domain (if any): `https://yourdomain.com/auth/callback`
- [ ] Enable Email authentication
- [ ] Test login flow locally
- [ ] Configure Row Level Security (RLS) policies if needed

### 5. Local Testing

- [ ] Run `npm install` successfully
- [ ] Run `npm run dev` without errors
- [ ] Test Google login
- [ ] Test text submission (300+ characters)
- [ ] Test file upload (PDF, DOC, DOCX)
- [ ] Verify detection progress display
- [ ] Check My Tasks page loads
- [ ] Test task download functionality
- [ ] Verify tab navigation works
- [ ] Test logout functionality
- [ ] Check mobile responsiveness
- [ ] Test all error scenarios

### 6. Build Verification

- [ ] Run `pnpm install` successfully
- [ ] Run `pnpm run build` successfully
- [ ] Ignore Supabase env warnings (expected)
- [ ] Run `pnpm start` and test production build locally
- [ ] Verify all pages load correctly
- [ ] Check console for errors

### 7. Vercel 项目连接（可选 - 如果还未创建）

- [ ] 在 Vercel Dashboard 创建新项目
- [ ] 选择 "Import Git Repository" 或手动创建
- [ ] 配置构建设置：
  - [ ] Framework Preset: Next.js
  - [ ] Build Command: `pnpm run build`
  - [ ] Install Command: `pnpm install`
  - [ ] Output Directory: `.next`
- [ ] 暂时不连接 Git（我们使用 GitLab CI/CD）

### 8. 首次部署

#### 方法 1: 通过 GitLab CI/CD（推荐）

- [ ] 确认所有 GitLab CI/CD 变量已配置
- [ ] Push 代码到 `test` 分支（Preview）:
  ```bash
  git push origin test
  ```
- [ ] 在 GitLab 监控 Pipeline 执行
- [ ] 验证 Build stage 完成
- [ ] 验证 Deploy stage 完成
- [ ] 访问 Vercel Dashboard 查看部署

#### 方法 2: 使用 Vercel CLI（本地测试）

- [ ] 安装 Vercel CLI: `npm install -g vercel`
- [ ] 登录: `vercel login`
- [ ] 部署到 Preview: `vercel`
- [ ] 测试 Preview 部署
- [ ] 部署到 Production: `vercel --prod`

### 9. Production 部署

- [ ] 确认 Preview 部署成功且功能正常
- [ ] Push 代码到 `master` 分支:
  ```bash
  git push origin master
  ```
- [ ] 监控 GitLab Pipeline
- [ ] 验证部署到 Vercel Production
- [ ] 访问 Production URL

### 10. Post-Deployment Verification

- [ ] Visit production URL
- [ ] Test login flow
- [ ] Submit test detection
- [ ] Check My Tasks page
- [ ] Verify API calls work
- [ ] Test file uploads
- [ ] Check download functionality
- [ ] Test on different browsers
- [ ] Test on mobile devices
- [ ] Monitor server resources
- [ ] Check application logs

### 11. 自定义域名配置（可选）

- [ ] 在 Vercel Dashboard → Settings → Domains 添加域名
- [ ] 配置 DNS 记录（CNAME 或 A 记录）
- [ ] 验证域名所有权
- [ ] 等待 SSL 证书自动配置
- [ ] 更新 Supabase Redirect URLs
- [ ] 测试自定义域名访问

### 12. Security Hardening

- [ ] 验证 `vercel.json` 中的安全头部已配置
- [ ] 检查 HTTPS 自动重定向
- [ ] 验证环境变量只在需要的环境中可用
- [ ] Enable CORS properly
- [ ] Disable debug mode in production
- [ ] Remove sensitive data from logs
- [ ] Review Vercel security settings
- [ ] 启用 Vercel Firewall（Pro 计划）

### 13. Monitoring & Logging

- [ ] 配置 Vercel Analytics（自动启用）
- [ ] 设置 PostHog 事件追踪（已集成）
- [ ] 配置 Microsoft Clarity（已集成）
- [ ] Set up error alerting (Vercel Dashboard)
- [ ] Set up uptime monitoring (外部服务如 UptimeRobot)
- [ ] Monitor Vercel logs regularly
- [ ] Configure backup strategy
- [ ] Document incident response plan

### 14. Documentation

- [ ] Document deployment process (完成 - 查看 VERCEL_DEPLOYMENT.md)
- [ ] Create runbook for common issues
- [ ] Document environment variables
- [ ] Update team wiki/docs
- [ ] Share credentials securely (Vercel Token, Project ID, etc.)
- [ ] Document rollback procedure

## 🚀 Quick Deploy Commands

### Deploy via GitLab CI/CD

\`\`\`bash
# Deploy to Preview (test branch)
git add .
git commit -m "feat: your feature"
git push origin test

# Deploy to Production (master branch)
git add .
git commit -m "feat: your feature"
git push origin master
\`\`\`

### Deploy via Vercel CLI (Local)

\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to Preview
vercel

# Deploy to Production
vercel --prod
\`\`\`

### Build Locally

\`\`\`bash
# Install dependencies
pnpm install

# Build
pnpm run build

# Test production build locally
pnpm start
\`\`\`

## 🔄 Rollback Procedure

### 在 Vercel Dashboard 中回滚

1. 访问 Vercel Dashboard
2. 选择项目
3. 进入 "Deployments" 页面
4. 找到之前的成功部署
5. 点击三个点菜单 → "Promote to Production"

### 使用 Git 回滚

\`\`\`bash
# 回滚到上一个提交
git revert HEAD
git push origin master

# 或者强制回滚（谨慎使用）
git reset --hard <commit-hash>
git push origin master --force
\`\`\`

### 使用 Vercel CLI 回滚

\`\`\`bash
# 查看部署历史
vercel ls

# 回滚到特定部署
vercel rollback [deployment-url]
\`\`\`

## 📊 Monitoring Commands

\`\`\`bash
# Vercel CLI 命令
vercel logs [url]                 # 查看日志
vercel logs --follow              # 实时日志
vercel ls                         # 列出部署
vercel inspect [url]              # 检查部署详情
vercel domains ls                 # 列出域名
vercel env ls                     # 列出环境变量

# GitLab CI/CD
# 在 GitLab UI 中查看: CI/CD → Pipelines
\`\`\`

## 🐛 Troubleshooting Checklist

### Deployment Failed

- [ ] Check GitLab CI/CD logs
- [ ] Verify `VERCEL_TOKEN` is valid and not expired
- [ ] Verify `VERCEL_PROJECT_ID` and `VERCEL_ORG_ID` are correct
- [ ] Check Vercel deployment logs in Dashboard
- [ ] Verify build command succeeds locally
- [ ] Check for Node.js version compatibility

### Application Error in Vercel

- [ ] Check Vercel Function logs: `vercel logs [url]`
- [ ] Verify all environment variables are set in Vercel
- [ ] Check browser console for errors
- [ ] Review Vercel Runtime logs
- [ ] Verify Vercel Function timeout limits

### Login not working

- [ ] Verify Supabase environment variables in Vercel
- [ ] Check redirect URLs in Supabase include Vercel URLs
- [ ] Verify Google OAuth credentials
- [ ] Check browser console for errors
- [ ] Verify HTTPS is enabled (Vercel auto-enables)
- [ ] Test with Vercel Preview URL first

### API calls failing

- [ ] Check API endpoint configuration
- [ ] Verify CORS settings
- [ ] Check authentication tokens
- [ ] Review network tab in browser
- [ ] Check API server status
- [ ] Verify environment variables in Vercel

### Build Timeout

- [ ] Optimize dependencies (remove unused packages)
- [ ] Check build logs for hanging processes
- [ ] Consider upgrading to Vercel Pro for longer timeout
- [ ] Optimize Next.js build configuration

## ✅ Sign-Off

### Development Team

- [ ] Code reviewed
- [ ] Tests passed
- [ ] Documentation complete
- [ ] Sign-off: ********\_******** Date: **\_\_\_**

### DevOps Team

- [ ] Infrastructure ready
- [ ] CI/CD configured
- [ ] Monitoring set up
- [ ] Sign-off: ********\_******** Date: **\_\_\_**

### Project Manager

- [ ] Requirements met
- [ ] Stakeholders informed
- [ ] Go-live approved
- [ ] Sign-off: ********\_******** Date: **\_\_\_**

## 📞 Emergency Contacts

- **DevOps**: [contact info]
- **Backend Team**: [contact info]
- **Project Manager**: [contact info]
- **On-Call**: [contact info]

## 🎯 Success Criteria

Deployment is considered successful when:

- ✅ Application is accessible at Vercel production URL
- ✅ All core features work (login, upload, detection, tasks)
- ✅ No critical errors in Vercel logs
- ✅ Response time < 2 seconds (Vercel Edge optimized)
- ✅ SSL certificate is active (auto by Vercel)
- ✅ All environment variables configured in Vercel
- ✅ GitLab CI/CD pipeline succeeds
- ✅ Supabase authentication works
- ✅ Analytics (PostHog, Clarity) tracking data
- ✅ Team trained on new Vercel deployment process

## 📚 Additional Resources

- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)
- [PostHog Setup Guide](./POSTHOG_SETUP.md)
- [Project README](./README.md)

---

**Last Updated**: 2025-10-11
**Version**: 2.0.0 (Vercel Deployment)
**Migration**: PM2/Nginx → Vercel Platform
