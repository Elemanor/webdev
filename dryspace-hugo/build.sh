#!/bin/bash
# Optimized Hugo build script following 2025 performance rules

echo "🚀 Starting optimized Hugo build..."

# Set environment
export HUGO_ENV="production"
export NODE_ENV="production"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf public resources/_gen

# Build with production config
echo "🔨 Building site with production optimizations..."
hugo --gc --minify --enableGitInfo --config config.toml,config.production.toml

# Check build metrics
echo "📊 Build metrics:"
hugo --templateMetrics --templateMetricsHints --config config.toml,config.production.toml

# Generate critical CSS if needed
echo "🎨 Optimizing CSS..."
# Add PurgeCSS or other CSS optimization here

echo "✅ Build complete!"
echo "📁 Output in: public/"

# Display size report
echo "📏 Build size report:"
du -sh public/
find public -name "*.html" -type f | wc -l | xargs echo "HTML files:"
find public -name "*.css" -type f | wc -l | xargs echo "CSS files:"
find public -name "*.js" -type f | wc -l | xargs echo "JS files:"