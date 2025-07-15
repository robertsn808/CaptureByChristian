#!/bin/bash

# CapturedCCollective Docker Logs Script

SERVICE=${1:-app}

echo "📝 Showing logs for: $SERVICE"
echo "Available services: app, database, redis, nginx"
echo ""

docker-compose logs -f $SERVICE