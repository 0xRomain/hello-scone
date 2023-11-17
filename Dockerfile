FROM node:16-alpine3.15

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

ENTRYPOINT [ "node", "/app/dist/app.js"]