# Use the official Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy db entrypoint script
COPY ./docker/dev/entrypoint.sh /app/entrypoint.sh

# Make the db entrypoint script executable
RUN chmod +x /app/entrypoint.sh

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application with nodemon
CMD ["npm", "run", "dev"]
