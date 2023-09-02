# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
# Install app dependencies
RUN npm ci 
# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# http port =80
ENV PORT=80

# Start the server using the production build
CMD [ "node", "dist/main.js" ]

