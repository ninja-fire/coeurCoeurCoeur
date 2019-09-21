FROM node:10.16.3 as builder

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package.json package-lock.json /usr/src/app/

RUN npm i
RUN npm audit fix


FROM node:10.16.0-alpine as release

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules /usr/src/app/node_modules

COPY . /usr/src/app
