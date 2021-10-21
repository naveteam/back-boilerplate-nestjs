FROM node:12.11.1-alpine AS builder
# Create app directory
EXPOSE 8000
RUN mkdir /workspace
WORKDIR /workspace
COPY . .
RUN npm install -g @types/node typescript ts-loader @nestjs/cli compression @nestjs/core @nestjs/common rxjs reflect-metadata
RUN npm install 
# RUN npx -p @nestjs/cli nest build
RUN npm run build 
# Bundle app source
RUN rm -fr ./src
CMD [ "node", "./dist/main.js" ]