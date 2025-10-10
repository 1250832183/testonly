#!/bin/bash

set -e

ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
  echo "Error: Environment not specified"
  echo "Usage: ./deploy.sh [production|staging]"
  exit 1
fi

echo "🚀 Starting deployment to $ENVIRONMENT..."

# Set environment-specific variables
if [ "$ENVIRONMENT" = "production" ]; then
  DEPLOY_USER=$DEPLOY_USER_PROD
  DEPLOY_HOST=$DEPLOY_HOST_PROD
  DEPLOY_PATH=$DEPLOY_PATH_PROD
  APP_PORT=${APP_PORT_PROD:-3000}
  PM2_APP_NAME="turnitin-checker-prod"
elif [ "$ENVIRONMENT" = "staging" ]; then
  DEPLOY_USER=$DEPLOY_USER_STAGING
  DEPLOY_HOST=$DEPLOY_HOST_STAGING
  DEPLOY_PATH=$DEPLOY_PATH_STAGING
  APP_PORT=${APP_PORT_STAGING:-3001}
  PM2_APP_NAME="turnitin-checker-staging"
else
  echo "Error: Invalid environment '$ENVIRONMENT'"
  exit 1
fi

echo "📦 Syncing files to server..."

# Create deployment directory if it doesn't exist
ssh ${DEPLOY_USER}@${DEPLOY_HOST} "mkdir -p ${DEPLOY_PATH}"

# Sync files to server (excluding unnecessary files)
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.next' \
  --exclude '.env.local' \
  --exclude 'README.md' \
  ./ ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/

# Sync .next build output
rsync -avz .next/ ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/.next/

# Sync node_modules
rsync -avz node_modules/ ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/node_modules/

echo "🔧 Setting up environment on server..."

# Execute remote commands
ssh ${DEPLOY_USER}@${DEPLOY_HOST} << EOF
  set -e
  
  cd ${DEPLOY_PATH}
  
  # Check if .env file exists, if not, copy from .env.example
  if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found, please create it manually"
  fi
  
  # Install PM2 if not already installed
  if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
  fi
  
  # Stop existing PM2 process
  pm2 stop ${PM2_APP_NAME} || true
  pm2 delete ${PM2_APP_NAME} || true
  
  # Start the application with PM2
  PORT=${APP_PORT} pm2 start npm --name ${PM2_APP_NAME} -- start
  
  # Save PM2 configuration
  pm2 save
  
  # Setup PM2 to start on system boot
  pm2 startup systemd -u ${DEPLOY_USER} --hp /home/${DEPLOY_USER} || true
  
  echo "✅ Deployment completed successfully!"
  echo "📊 Application status:"
  pm2 list
EOF

echo "🎉 Deployment to $ENVIRONMENT completed!"
echo "🌐 Application should be running on port $APP_PORT"

