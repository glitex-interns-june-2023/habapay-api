# Define base image as ubuntu:20.04
FROM ubuntu:20.04

# Nodejs image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the package.json file
COPY package.json .

# Install the dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# Expose the port
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "cd src/ && npx sequelize-cli db:migrate && cd .. && npm start"]
