FROM node:16.15-alpine3.15

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm ci --only=production

COPY . .

EXPOSE 3200

CMD ["node", "index.js"]