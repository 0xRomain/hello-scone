FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY ./src .

ENTRYPOINT [ "node", "/app/app.js"]