FROM node:16-slim

# Install arma dependencies
RUN dpkg --add-architecture i386 && apt-get update && apt-get install -y git lib32stdc++6 zlib1g:i386 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install node dependencies for the application
RUN mkdir /app
COPY package.json /app/package.json
WORKDIR /app
RUN npm install

# Install Docker config
COPY config.docker.js /app/config.js

# Create empty servers config
RUN echo '[]' > /app/servers.json

# Copy rest of application to image
COPY . /app/

# Start application
CMD npm start

# Declare application port
EXPOSE 3000
