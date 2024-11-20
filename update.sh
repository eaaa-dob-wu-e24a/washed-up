#!/bin/bash

# Script Vars
GITHUB_TOKEN="your_github_token_here"
REPO_URL="https://$GITHUB_TOKEN@github.com/eaaa-dob-wu-e24a/final-project-fucc.git"
APP_DIR=~/booking_app/myapp

# Pull the latest changes from the Git repository
if [ -d "$APP_DIR" ]; then
  echo "Pulling latest changes from the repository..."
  cd $APP_DIR
  git pull origin main
else
  echo "Cloning repository from $REPO_URL..."
  git clone $REPO_URL $APP_DIR
  cd $APP_DIR
fi

# Rebuild the Docker images without using cache
echo "Building Docker containers without cache..."
sudo docker-compose build --no-cache

# Restart the Docker containers after the build
echo "Rebuilding and restarting Docker containers..."
sudo docker-compose down
sudo docker-compose up -d

# Check if Docker Compose started correctly
if ! sudo docker-compose ps | grep "Up"; then
  echo "Docker containers failed to start. Check logs with 'docker-compose logs'."
  exit 1
fi

# Output final message
echo "Update complete. Your SvelteKit and Laravel app has been redeployed with the latest changes."