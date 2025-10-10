# Turnitin Checker - Deployment Checklist

## 📋 Pre-Deployment Checklist

### 1. Environment Configuration

- [ ] Create `.env.local` file with all required variables
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Set `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Set `NEXT_PUBLIC_PREFIX`
- [ ] Set `NEXT_PUBLIC_API_BASE_URL`
- [ ] Verify all environment variables are correct

### 2. Supabase Setup

- [ ] Create Supabase project
- [ ] Enable Google OAuth provider
- [ ] Configure Google Cloud OAuth credentials
- [ ] Add authorized redirect URIs:
  - [ ] Development: `http://localhost:3000/auth/callback`
  - [ ] Production: `https://yourdomain.com/auth/callback`
- [ ] Enable Email authentication
- [ ] Test login flow locally
- [ ] Configure Row Level Security (RLS) policies if needed

### 3. Local Testing

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

### 4. Build Verification

- [ ] Run `npm run build` successfully
- [ ] Ignore Supabase env warnings (expected)
- [ ] Run `npm start` and test production build locally
- [ ] Verify all pages load correctly
- [ ] Check console for errors

### 5. Server Preparation

- [ ] Set up production server (Ubuntu/Debian recommended)
- [ ] Install Node.js 18+ (20+ recommended)
- [ ] Install PM2 globally: `npm install -g pm2`
- [ ] Install Nginx
- [ ] Configure firewall (ports 22, 80, 443)
- [ ] Set up SSH access with key authentication
- [ ] Create deployment directory: `/var/www/turnitin-checker`
- [ ] Set proper permissions

### 6. GitLab CI/CD Configuration

- [ ] Add SSH_PRIVATE_KEY to GitLab CI/CD variables
- [ ] Add DEPLOY_USER_PROD
- [ ] Add DEPLOY_HOST_PROD
- [ ] Add DEPLOY_PATH_PROD
- [ ] Add APP_PORT_PROD
- [ ] Verify all variables are protected
- [ ] Test SSH connection from GitLab runner

### 7. Nginx Configuration

- [ ] Configure Nginx reverse proxy
- [ ] Set up server block for domain
- [ ] Configure SSL/TLS (Let's Encrypt)
- [ ] Enable HTTPS redirect
- [ ] Test Nginx configuration: `nginx -t`
- [ ] Reload Nginx: `systemctl reload nginx`

### 8. First Deployment

- [ ] Push code to `main` branch
- [ ] Monitor GitLab CI/CD pipeline
- [ ] Verify build stage completes
- [ ] Verify deploy stage completes
- [ ] Check PM2 process is running: `pm2 list`
- [ ] View PM2 logs: `pm2 logs turnitin-checker`
- [ ] Test website accessibility

### 9. Post-Deployment Verification

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

### 10. Security Hardening

- [ ] Configure firewall rules
- [ ] Enable fail2ban for SSH
- [ ] Set up automatic security updates
- [ ] Configure rate limiting
- [ ] Enable CORS properly
- [ ] Disable debug mode
- [ ] Remove sensitive data from logs
- [ ] Set secure cookie flags
- [ ] Configure CSP headers
- [ ] Enable HSTS

### 11. Monitoring & Logging

- [ ] Set up PM2 monitoring
- [ ] Configure log rotation
- [ ] Set up error alerting
- [ ] Monitor server resources (CPU, RAM, Disk)
- [ ] Set up uptime monitoring
- [ ] Configure backup strategy
- [ ] Document incident response plan

### 12. Documentation

- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Document environment variables
- [ ] Update team wiki/docs
- [ ] Share credentials securely
- [ ] Document rollback procedure

## 🚀 Quick Deploy Commands

### Initial Setup

\`\`\`bash

# On server

curl -O [repo-url]/scripts/setup-server.sh
chmod +x setup-server.sh
./setup-server.sh
\`\`\`

### Deploy via GitLab

\`\`\`bash

# From local machine

git push origin main
\`\`\`

### Manual Deploy

\`\`\`bash

# Build locally

npm run build

# Sync to server

rsync -avz --exclude 'node_modules' ./ user@server:/var/www/turnitin-checker/

# On server

cd /var/www/turnitin-checker
npm install --production
pm2 restart turnitin-checker || pm2 start npm --name turnitin-checker -- start
pm2 save
\`\`\`

## 🔄 Rollback Procedure

If deployment fails:

\`\`\`bash

# On server

cd /var/www/turnitin-checker

# If using Git

git checkout HEAD~1
npm install
pm2 restart turnitin-checker

# If using manual deploy

# Restore from backup

cp -r ../turnitin-checker-backup/\* .
pm2 restart turnitin-checker
\`\`\`

## 📊 Monitoring Commands

\`\`\`bash

# Check PM2 status

pm2 list
pm2 logs turnitin-checker --lines 100
pm2 monit

# Check Nginx

sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check server resources

htop
df -h
free -h
\`\`\`

## 🐛 Troubleshooting Checklist

### Application won't start

- [ ] Check PM2 logs: `pm2 logs turnitin-checker`
- [ ] Verify environment variables exist
- [ ] Check Node.js version
- [ ] Verify port is not in use
- [ ] Check file permissions

### Login not working

- [ ] Verify Supabase environment variables
- [ ] Check redirect URLs in Supabase
- [ ] Verify Google OAuth credentials
- [ ] Check browser console for errors
- [ ] Verify HTTPS is enabled

### API calls failing

- [ ] Check API endpoint configuration
- [ ] Verify CORS settings
- [ ] Check authentication tokens
- [ ] Review network tab in browser
- [ ] Check API server status

### File upload failing

- [ ] Check file size limits
- [ ] Verify upload endpoint
- [ ] Check server disk space
- [ ] Review file type restrictions
- [ ] Check Nginx upload limits

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

- ✅ Application is accessible at production URL
- ✅ All core features work (login, upload, detection, tasks)
- ✅ No critical errors in logs
- ✅ Response time < 2 seconds
- ✅ Uptime > 99% over 24 hours
- ✅ All monitoring alerts configured
- ✅ Team trained on deployment process

---

**Last Updated**: [Date]
**Version**: 1.0.0
**Reviewer**: [Name]
