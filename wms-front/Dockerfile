# Step 1: Use the official Node.js 16 image as the base image
FROM node:16-alpine

# Step 2: Install necessary packages for building native modules
RUN apk add --no-cache --virtual .gyp \
    python3 \
    make \
    g++ \
    && apk add --no-cache \
    pkgconfig \
    cairo-dev \
    pango-dev \
    giflib-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    && npm config set python /usr/bin/python3

# Step 3: Set the working directory
WORKDIR /app

# Step 4: Copy package.json and package-lock.json into the container
COPY package.json package-lock.json ./

# Step 5: Install dependencies with legacy peer dependencies option
RUN npm install --legacy-peer-deps

# Step 6: Copy the rest of the application code into the container
COPY . .

# Step 7: Build the application
RUN npm run build

# Step 8: Expose the port the app runs on
EXPOSE 3000

# Step 9: Define the command to run the application
CMD ["npm", "start"]
