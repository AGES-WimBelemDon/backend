FROM node:22.18.0-alpine
WORKDIR /usr/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
EXPOSE 3000
EXPOSE 9229
CMD ["yarn", "start:debug"]