FROM node:20-buster

# Install build dependencies
RUN apt-get update && apt-get install -y python3 g++ make

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm rebuild bcrypt --build-from-source

RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/main.js" ]