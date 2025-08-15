#!/bin/bash

# QuickNotes CRM - Setup Script
# This script helps you get started with the QuickNotes CRM project

echo "🚀 QuickNotes CRM - Setup Script"
echo "================================="
echo

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=crm_db

# Server Configuration
PORT=3000
NODE_ENV=development

# RabbitMQ Configuration
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=crm_user
RABBITMQ_PASSWORD=crm_password
RABBITMQ_VHOST=crm_vhost

# Frontend Configuration
FRONTEND_PORT=4200
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

echo
echo "📦 Starting services with Docker Compose..."
echo

# Start all services
docker-compose up -d

echo
echo "⏳ Waiting for MySQL to be ready..."
echo

# Wait for MySQL to be ready
until docker-compose exec mysql mysql -uroot -prootpassword -e "SELECT 1" &> /dev/null; do
    echo "Waiting for MySQL..."
    sleep 5
done

echo
echo "🗄️ Setting up database..."
echo

# Create database and tables
docker-compose exec mysql mysql -uroot -prootpassword -e "CREATE DATABASE IF NOT EXISTS crm_db;"
docker-compose exec mysql mysql -uroot -prootpassword crm_db < database/schema.sql

echo
echo "✅ Database setup complete!"
echo

# Check if services are running
echo "🔍 Checking service status..."
echo

docker-compose ps

echo
echo "🎉 Setup Complete!"
echo

echo "📋 Quick Start Guide:"
echo "==================="
echo "1. Backend API: http://localhost:3000"
echo "2. API Documentation: http://localhost:3000/api-docs"
echo "3. Frontend: http://localhost:4200"
echo "4. MySQL: localhost:3306"
echo "5. RabbitMQ Management: http://localhost:15672 (user: crm_user, password: crm_password)"
echo

echo "📝 Available Commands:"
echo "====================="
echo "- Start services: docker-compose up -d"
echo "- Stop services: docker-compose down"
echo "- View logs: docker-compose logs [service-name]"
echo "- Restart services: docker-compose restart"
echo "- Access backend: docker-compose exec backend sh"
echo "- Access frontend: docker-compose exec frontend sh"
echo "- Access MySQL: docker-compose exec mysql mysql -uroot -prootpassword crm_db"
echo

echo "🚀 Your QuickNotes CRM is ready to use!"