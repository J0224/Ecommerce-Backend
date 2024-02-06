# Use an official Node.js runtime as a base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . ./

# Expose the port on which the app will run
EXPOSE 8000

# Command to run the application
CMD exec npm start
