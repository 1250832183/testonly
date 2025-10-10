# Turnitin Checker - Setup Guide

## 🚀 Quick Start

### 1. Environment Variables Setup

Create a `.env.local` file in the root directory:

\`\`\`env

# API Configuration

NEXT_PUBLIC_PREFIX=https://api.answer-ai.com
NEXT_PUBLIC_API_BASE_URL=https://api.answer-ai.com/api/v1

# Supabase Configuration

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 2. Supabase Setup

#### Create Supabase Project

1. Visit [Supabase](https://supabase.com) and create a new project
2. Copy your project URL and anon key from Settings > API

#### Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs:
     - Development: \`http://localhost:3000/auth/callback\`
     - Production: \`https://yourdomain.com/auth/callback\`
5. Copy Client ID and Client Secret
6. In Supabase Dashboard > Authentication > Providers:
   - Enable Google provider
   - Paste your Client ID and Client Secret
   - Add redirect URLs

#### Configure Email Authentication

1. In Supabase Dashboard > Authentication > Providers
2. Enable Email provider
3. Configure email templates if needed

### 3. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure Overview

\`\`\`
turnitin-checker/
├── app/ # Next.js 14 App Router
│ ├── auth/callback/ # OAuth callback handler
│ ├── my-tasks/ # Task list page
│ ├── layout.tsx # Root layout with Navbar
│ ├── page.tsx # Home/Upload page
│ └── globals.css # Global styles
├── components/ # Reusable components
│ ├── Navbar/ # Navigation with tabs & auth
│ ├── LottieAnimation/ # Animation component
│ └── TurnitinSubscription/ # Subscription modal
├── stores/ # MobX state management
│ ├── main.ts # User & plan state
│ └── turnitin.ts # Tasks state
├── modules/api/ # API integration
│ ├── main.ts # File upload, user plan
│ └── turnitin.ts # Submit, poll, tasks
└── lib/ # Core utilities
├── supabase.ts # Client-side auth
└── supabase-server.ts # Server-side auth
\`\`\`

## 🎨 Theme Customization

The app uses a professional blue-white color scheme:

### Primary Colors

- **Primary Blue**: \`#3b82f6\` (Gradient with \`#2563eb\`)
- **Navy**: \`#1e3a8a\`
- **Light Blue BG**: \`#f0f9ff\` to \`#e0f2fe\`
- **White**: \`#ffffff\`

### Component Colors

- **Navbar**: Blue gradient (\`#1e3a8a\` to \`#3b82f6\`)
- **Buttons**: Blue gradient or white with blue border
- **Cards**: White with subtle blue shadows
- **Text**: Navy for headings, gray for body

To customize colors, edit:

- \`components/Navbar/index.module.scss\`
- \`app/page.module.scss\`
- \`app/my-tasks/page.module.scss\`

## 🔧 API Integration

### Available Endpoints

#### File Upload

\`\`\`typescript
import { uploadFile } from '@/modules/api/main'
const result = await uploadFile(file)
\`\`\`

#### Submit Detection

\`\`\`typescript
import { submitTurnitinDetection } from '@/modules/api/turnitin'
const result = await submitTurnitinDetection({
type: 1, // 0=text, 1=file
fileUrl: 'https://...'
})
\`\`\`

#### Poll Results

\`\`\`typescript
import { pollTurnitinResult } from '@/modules/api/turnitin'
const result = await pollTurnitinResult(taskId, (status, aiWriting) => {
console.log('Progress:', status, aiWriting)
})
\`\`\`

#### Get Tasks

\`\`\`typescript
import { getTurnitinTaskList } from '@/modules/api/turnitin'
const result = await getTurnitinTaskList()
\`\`\`

## 🚢 Deployment

### Option 1: GitLab CI/CD (Recommended)

#### Server Setup

\`\`\`bash

# SSH into your server

ssh user@yourserver.com

# Run setup script

curl -O https://your-gitlab-repo/raw/main/scripts/setup-server.sh
chmod +x setup-server.sh
./setup-server.sh
\`\`\`

#### GitLab CI/CD Variables

Add these in GitLab Project > Settings > CI/CD > Variables:

**Production:**

- \`SSH_PRIVATE_KEY\`: Your SSH private key
- \`DEPLOY_USER_PROD\`: Server username (e.g., \`ubuntu\`)
- \`DEPLOY_HOST_PROD\`: Server IP or hostname
- \`DEPLOY_PATH_PROD\`: App path (e.g., \`/var/www/turnitin-checker\`)
- \`APP_PORT_PROD\`: Port number (default: \`3000\`)

**Staging (optional):**

- Same variables with \`\_STAGING\` suffix

#### Deploy

\`\`\`bash
git push origin main # Deploys to production
git push origin develop # Deploys to staging
\`\`\`

### Option 2: Manual Deployment

\`\`\`bash

# Build

npm run build

# Copy .env.local to server

scp .env.local user@server:/var/www/turnitin-checker/

# Copy files to server

rsync -avz --exclude 'node_modules' ./ user@server:/var/www/turnitin-checker/

# SSH into server

ssh user@server

# Install dependencies and start

cd /var/www/turnitin-checker
npm install
pm2 start npm --name turnitin-checker -- start
pm2 save
\`\`\`

## 🔒 Security Checklist

- [ ] Set strong \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
- [ ] Configure Row Level Security (RLS) in Supabase
- [ ] Use HTTPS in production
- [ ] Set up firewall rules (ports 22, 80, 443 only)
- [ ] Enable fail2ban for SSH protection
- [ ] Regular security updates: \`apt-get update && apt-get upgrade\`
- [ ] Use environment variables for all secrets
- [ ] Configure CORS properly in API
- [ ] Set up rate limiting

## 📊 Monitoring

### PM2 Commands

\`\`\`bash
pm2 list # List all apps
pm2 logs turnitin-checker # View logs
pm2 restart turnitin-checker # Restart app
pm2 stop turnitin-checker # Stop app
pm2 monit # Monitor resources
\`\`\`

### Nginx Logs

\`\`\`bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
\`\`\`

## 🐛 Troubleshooting

### Issue: "Module not found" errors

\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Issue: Build fails

\`\`\`bash
npm run lint
npm run build -- --debug
\`\`\`

### Issue: Supabase auth not working

1. Check redirect URLs in Supabase Dashboard
2. Verify \`NEXT_PUBLIC_SUPABASE_URL\` and \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
3. Check browser console for errors
4. Ensure \`/auth/callback\` route exists

### Issue: API calls failing

1. Check \`NEXT_PUBLIC_PREFIX\` in \`.env.local\`
2. Verify API is accessible from your server
3. Check CORS settings on API server
4. Review network tab in browser dev tools

## 📞 Support

For issues or questions:

1. Check the [README.md](./README.md)
2. Review logs: \`pm2 logs turnitin-checker\`
3. Contact your system administrator

## 🎯 Next Steps

After setup:

1. Test login flow with Google OAuth
2. Upload a test document
3. Monitor task detection progress
4. Check My Tasks page
5. Test download functionality
6. Configure SSL certificate (Let's Encrypt)
7. Set up monitoring and alerts
8. Configure backup strategy
