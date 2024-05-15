# Use the official Node.js 16 image as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]

# # Use Node.js image as the base image
# FROM node:latest

# # Set working directory
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json to the working directory
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Install sequelize CLI globally
# RUN npm install -g sequelize-cli

# # Copy the rest of the application code to the working directory
# COPY . .

# # Expose the port your app runs on
# EXPOSE 3000

# # Command to run your app
# CMD ["npm", "start"]
