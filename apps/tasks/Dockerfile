# Use Node Alpine as the base image for development
FROM node:alpine as development

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install -g && yarn install

COPY . .

RUN yarn build

# Create a production image
FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install --only=production

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/package.json ./package.json

CMD [ "node", "dist/apps/tasks/main" ]
