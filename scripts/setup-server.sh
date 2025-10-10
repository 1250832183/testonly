#!/bin/bash

# Server Setup Script for Turnitin Checker
# Run this script on your server to prepare it for deployment

set -e

echo "🔧 Setting up server for Turnitin Checker..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js using nvm
if ! command -v node &> /dev/null; then
  echo "📥 Installing Node.js..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  nvm install 18.18.0
  nvm use 18.18.0
  nvm alias default 18.18.0
fi

# Install PM2 globally
echo "📥 Installing PM2..."
npm install -g pm2

# Install Nginx if not already installed
if ! command -v nginx &> /dev/null; then
  echo "📥 Installing Nginx..."
  sudo apt-get install -y nginx
fi

# Create application directory
APP_DIR="/var/www/turnitin-checker"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Configure Nginx
echo "🌐 Configuring Nginx..."
sudo tee /etc/nginx/sites-available/turnitin-checker > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable Nginx site
sudo ln -sf /etc/nginx/sites-available/turnitin-checker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Install SSL certificate (optional - requires domain setup)
echo "🔒 To install SSL certificate, run:"
echo "sudo apt-get install -y certbot python3-certbot-nginx"
echo "sudo certbot --nginx -d your-domain.com -d www.your-domain.com"

echo "✅ Server setup completed!"
echo "📝 Next steps:"
echo "1. Create .env.local file in $APP_DIR with your environment variables"
echo "2. Configure GitLab CI/CD variables in your GitLab project settings:"
echo "   - SSH_PRIVATE_KEY: Your SSH private key"
echo "   - DEPLOY_USER_PROD: Your server username"
echo "   - DEPLOY_HOST_PROD: Your server hostname/IP"
echo "   - DEPLOY_PATH_PROD: Application path (e.g., $APP_DIR)"
echo "   - APP_PORT_PROD: Application port (default: 3000)"
echo "3. Push your code to GitLab to trigger the deployment"

