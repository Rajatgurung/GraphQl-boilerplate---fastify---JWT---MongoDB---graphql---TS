# syntax=docker/dockerfile:1
FROM node:15

WORKDIR /code

COPY package.json /code/package.json
COPY package-lock.json /code/package-lock.json

RUN npm ci
RUN mkdir build 
RUN mkdir build/assets 
COPY . .
CMD [ "npm","run" ,"start" ]
