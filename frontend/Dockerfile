# Use Node.js image
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install --force

# Copy source code and build
COPY . .
RUN npm run lint

# Use Nginx for serving the app
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
