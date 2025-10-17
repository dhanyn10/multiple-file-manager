# Use an Ubuntu image which has more build libraries than Alpine
# This is important for dependencies required by electron-builder
FROM ubuntu:22.04 AS builder

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install base dependencies and Node.js
RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    # Dependencies required by electron-builder for Linux builds
    apt-get install -y --no-install-recommends libsecret-1-dev libglib2.0-dev libatk1.0-dev libatk-bridge2.0-dev libgtk-3-dev libgdk-pixbuf2.0-dev libx11-dev libx11-xcb-dev libxcb-dri3-0 libxtst-dev libnss3-dev libasound2-dev

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install --ignore-scripts

# Copy the rest of the application files
COPY . .

# Run the build script which will call electron-builder
RUN npm run build