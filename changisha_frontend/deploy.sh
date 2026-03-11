#!/bin/bash

# Changisha Bills Frontend Deployment Script

set -e

echo "🚀 Starting Changisha Bills Frontend Deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! node -e "process.exit(require('semver').gte('$NODE_VERSION', '$REQUIRED_VERSION') ? 0 : 1)" 2>/dev/null; then
    echo "❌ Node.js version $NODE_VERSION is not supported. Please use Node.js 18+."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run type checking
echo "🔍 Running type check..."
npm run type-check

# Run tests
echo "🧪 Running tests..."
npm run test

# Build the application
echo "🏗️ Building application..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully"

# Analyze bundle size if requested
if [ "$1" = "--analyze" ]; then
    echo "📊 Analyzing bundle size..."
    npm run build:analyze
fi

# Create deployment package
echo "📦 Creating deployment package..."
DEPLOY_DIR="deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR"

# Copy build files
cp -r dist/* "$DEPLOY_DIR/"

# Copy deployment configuration
cat > "$DEPLOY_DIR/deploy.json" << EOF
{
  "buildTime": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "version": "$(node -p "require('./package.json').version")",
  "environment": "${NODE_ENV:-production}"
}
EOF

# Create .htaccess for Apache servers
cat > "$DEPLOY_DIR/.htaccess" << EOF
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/x-javascript "access plus 1 month"
  ExpiresByType application/x-shockwave-flash "access plus 1 month"
  ExpiresByType image/x-icon "access plus 1 year"
</IfModule>
EOF

echo "✅ Deployment package created: $DEPLOY_DIR"

# Show build statistics
echo ""
echo "📊 Build Statistics:"
echo "-------------------"
du -sh "$DEPLOY_DIR"
find "$DEPLOY_DIR" -name "*.js" -o -name "*.css" | wc -l | xargs echo "Total assets:"

echo ""
echo "🎉 Deployment ready!"
echo "📁 Deployment package: $DEPLOY_DIR"
echo ""
echo "Next steps:"
echo "1. Upload contents of $DEPLOY_DIR to your web server"
echo "2. Configure your web server to serve index.html for all routes"
echo "3. Ensure environment variables are set on your server"
echo ""
echo "For production deployment, consider:"
echo "- Using a CDN for static assets"
echo "- Setting up proper SSL certificates"
echo "- Configuring caching headers"
echo "- Setting up monitoring and error tracking"
