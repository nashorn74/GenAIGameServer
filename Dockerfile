FROM node:22-alpine

# Install build dependencies
RUN apk add --no-cache python3 g++ make

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm rebuild bcrypt --build-from-source

RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/main.js" ]

