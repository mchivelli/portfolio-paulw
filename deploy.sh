#!/bin/bash

# Portfolio Deployment Script for Ubuntu Server
# Run this script on your Ubuntu server to deploy the portfolio

set -e  # Exit on any error

echo "🚀 Starting Portfolio Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    print_status "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    print_success "Node.js already installed: $(node --version)"
fi

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2..."
    sudo npm install -g pm2
else
    print_success "PM2 already installed"
fi

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    print_status "Installing Nginx..."
    sudo apt install nginx -y
    sudo systemctl start nginx
    sudo systemctl enable nginx
else
    print_success "Nginx already installed"
fi

# Install Git if not installed
if ! command -v git &> /dev/null; then
    print_status "Installing Git..."
    sudo apt install git -y
else
    print_success "Git already installed"
fi

# Create application directory
APP_DIR="/var/www/portfolio"
if [ ! -d "$APP_DIR" ]; then
    print_status "Creating application directory..."
    sudo mkdir -p /var/www
    
    # Prompt for repository URL
    read -p "Enter your GitHub repository URL: " REPO_URL
    sudo git clone "$REPO_URL" "$APP_DIR"
    sudo chown -R $USER:$USER "$APP_DIR"
else
    print_status "Application directory exists, pulling latest changes..."
    cd "$APP_DIR"
    git pull origin main || git pull origin master
fi

cd "$APP_DIR"

# Install dependencies
print_status "Installing frontend dependencies..."
npm install

print_status "Installing backend dependencies..."
cd server
npm install
cd ..

# Build frontend
print_status "Building frontend..."
npm run build

# Setup environment file
if [ ! -f "server/.env" ]; then
    print_warning "Environment file not found. Please configure Mailgun credentials."
    cp server/.env.example server/.env
    
    echo ""
    echo "Please edit server/.env with your Mailgun credentials:"
    echo "nano server/.env"
    echo ""
    echo "Required variables:"
    echo "MAILGUN_API_KEY=your-api-key"
    echo "MAILGUN_DOMAIN=your-domain.com"
    echo ""
    read -p "Press Enter after configuring the environment file..."
fi

# Test backend configuration
print_status "Testing backend configuration..."
cd server
if npm run test-email; then
    print_success "Mailgun configuration test passed!"
else
    print_warning "Mailgun test failed. Please check your configuration."
fi
cd ..

# Create PM2 ecosystem file
print_status "Creating PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'portfolio-backend',
    cwd: '$APP_DIR/server',
    script: 'index.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/pm2/portfolio-error.log',
    out_file: '/var/log/pm2/portfolio-out.log',
    log_file: '/var/log/pm2/portfolio-combined.log',
    time: true
  }]
};
EOF

# Create log directory
sudo mkdir -p /var/log/pm2
sudo chown $USER:$USER /var/log/pm2

# Start application with PM2
print_status "Starting application with PM2..."
pm2 delete portfolio-backend 2>/dev/null || true  # Delete if exists
pm2 start ecosystem.config.js
pm2 save

# Setup PM2 startup
print_status "Configuring PM2 startup..."
pm2 startup | grep "sudo" | bash || true

# Configure Nginx
print_status "Configuring Nginx..."
read -p "Enter your domain name (or server IP): " DOMAIN_NAME

sudo tee /etc/nginx/sites-available/portfolio > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;
    
    # Frontend (Static Files)
    location / {
        root $APP_DIR/dist;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Configure firewall
print_status "Configuring firewall..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Final tests
print_status "Running final tests..."

# Test frontend
if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200"; then
    print_success "Frontend is accessible!"
else
    print_warning "Frontend test failed"
fi

# Test backend
if curl -s http://localhost/api/health | grep -q "ok"; then
    print_success "Backend API is working!"
else
    print_warning "Backend API test failed"
fi

print_success "🎉 Deployment completed!"
echo ""
echo "Your portfolio is now available at:"
echo "http://$DOMAIN_NAME"
echo ""
echo "Useful commands:"
echo "pm2 status                    # Check application status"
echo "pm2 logs portfolio-backend    # View logs"
echo "pm2 restart portfolio-backend # Restart application"
echo "sudo systemctl status nginx  # Check Nginx status"
echo ""
echo "To setup SSL certificate (recommended):"
echo "sudo apt install snapd"
echo "sudo snap install --classic certbot"
echo "sudo certbot --nginx -d $DOMAIN_NAME"
echo ""
print_success "Happy coding! 🚀"