# Use the official Node.js image as the base image
FROM node:16

# Set environment variables
ENV NODE_ENV=development
ENV APP_NAME=InventoryControl
ENV APP_ENV=local
ENV APP_KEY=base64:28b8LR4NS6GkMnJvP1uAyeaLCcCtLF7eZL1ONIBXySY=
ENV API_KEY=28b8LR4NS6GkMnJvP1uAyeaLCcCtLF7eZL1ONIBXySY=
ENV APP_DEBUG=true
ENV APP_URL=http://localhost:4040
ENV APP_PORT=4040

ENV DB_CONNECTION=mongodb
ENV DB_HOST=mongo
ENV DB_PORT=27017
ENV DB_DATABASE=supply_chain
ENV DB_USERNAME=
ENV DB_PASSWORD=
ENV REDIS_HOST=redis
ENV REDIS_PASSWORD=null
ENV REDIS_PORT=6379


ENV BROADCAST_DRIVER=log
ENV CACHE_DRIVER=file
ENV QUEUE_CONNECTION=sync
ENV SESSION_DRIVER=file
ENV SESSION_LIFETIME=120

ENV REDIS_HOST=127.0.0.1
ENV REDIS_PASSWORD=null
ENV REDIS_PORT=6379

ENV MAIL_DRIVER=smtp
ENV MAIL_HOST=smtp.mailtrap.io
ENV MAIL_PORT=2525
ENV MAIL_USERNAME=null
ENV MAIL_PASSWORD=null
ENV MAIL_ENCRYPTION=null



# Create and set the working directory
WORKDIR /var/app

# Copy package.json and package-lock.json to the container
COPY package*.json yarn.lock ./

# Install Node.js dependencies
RUN yarn install

# Copy the rest of the application files to the container
COPY ./ ./

# Start the Node.js application
CMD ["yarn","dev"]