FROM node:dubnium-alpine

WORKDIR /home/node/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

CMD ["yarn", "start:server"]
