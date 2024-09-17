# Stage 1: Build the application
FROM node:18 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# RUN npm run build
# Stage 2: Run the application
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=builder /app .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["sh", "-c", "cd src/ && npx sequelize-cli db:migrate && cd .. && npm start"]
