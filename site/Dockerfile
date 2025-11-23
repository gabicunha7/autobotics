FROM node:21.7-alpine3.18
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /
COPY . .
RUN npm install
EXPOSE 3333 8080
CMD ["node", "app.js"] 