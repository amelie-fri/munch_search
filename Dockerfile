# Instructions for Docker for building the Node.js image 
# Use Node v12.14.1 LTS - the image to start with 
FROM node:erbium

# Setup the working directory for the application 
WORKDIR /usr/src/app

# Copy the files package.json and package-lock.json
COPY package*.json ./

# Install the module dependencies mentioned in package.json
RUN npm install

# Copy the application code
COPY . .

# Run npm start when the container is up and running to start the application.
CMD [ "npm", "start" ]



