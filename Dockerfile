FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY server ./server
COPY client/build ./client/build
COPY PERSONALITY.md ./

# Expose ports
EXPOSE 3001 3000

# Start the application
CMD ["npm", "start"]
