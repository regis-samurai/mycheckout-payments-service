# Since we rely in our code to environment variables for e.g. db connection
# this can only be run successfully with docker-compose file

# Specify node version and choose image
# also name our image as development (can be anything)
FROM node:14-alpine AS development
# Set node env to prod
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Specify our working directory, this is in our container/in our image
WORKDIR /kuikpay-payment/src

# Copy the package.jsons from host to container
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Here we install all the deps
RUN npm install --only=dev
RUN npm install rimraf

# Bundle app source / copy all other files
COPY . .

# Build the app to the /dist folder
RUN npm run build

################
## PRODUCTION ##
################
# Build another image named production
FROM node:14-alpine AS production

# Set node env to prod
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set Working Directory
WORKDIR /kuikpay-payment/src

COPY package*.json ./

RUN npm install --only=production

COPY . .

# Copy all from development stage
COPY --from=development /kuikpay-payment/src/dist ./dist

# Run app
CMD [ "node", "dist/main" ]
