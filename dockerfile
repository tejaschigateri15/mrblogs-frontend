FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

RUN npm install --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Expose the port on which your application runs
EXPOSE 5173

# Define the command to start your application
CMD ["npm", "run", "dev"]

# Build stage
# FROM node:18-alpine as build

# WORKDIR /app

# # Copy package.json and package-lock.json files
# COPY package*.json ./

# # Clear npm cache and install dependencies
# RUN npm cache clean --force && npm install --force

# # Copy the rest of the application files
# COPY . .

# # Build the application
# RUN npm run build

# # Production stage
# FROM nginx:alpine

# # Copy the built files from the build stage
# COPY --from=build /app/dist /usr/share/nginx/html

# # Expose the port on which Nginx will run
# EXPOSE 80

# # Start Nginx
# CMD ["nginx", "-g", "daemon off;"]