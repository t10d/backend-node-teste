FROM node:16
WORKDIR /app
COPY ./package.json .
RUN npm install --only=prod
COPY ./dist ./dist
COPY ./keys ./keys
EXPOSE 6060
CMD npm start