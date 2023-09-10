# Use an official Node.js runtime as the base image for building
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the project dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Use yarn to add TypeScript to the project
RUN yarn add typescript

# Build your application
RUN yarn build

# Expose the port your application will run on (adjust as needed)
# EXPOSE 3000

# Command to start your application
CMD ["node", "dist/sharding.js"]
