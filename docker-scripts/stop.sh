#!/bin/bash

# CapturedCCollective Docker Stop Script

echo "🛑 Stopping CapturedCCollective..."

# Stop all services
docker-compose down

# Optional: Remove volumes (uncomment if you want to reset data)
# echo "🗑️  Removing volumes..."
# docker-compose down -v

echo "✅ CapturedCCollective stopped successfully!"