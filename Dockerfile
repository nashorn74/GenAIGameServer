FROM node:16

WORKDIR /nest
COPY package*.json ./
RUN npm install

COPY . .

RUN npm install -g @nestjs/cli && npm install -D concurrently

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
