FROM node:12.16.3

RUN mkdir /var/opt/server

WORKDIR /var/opt/build

COPY . .

RUN npm install
RUN npm run build


ENV CONFIG_PATH=/var/opt/config
ENV NODE_ENV=production


EXPOSE 5000
CMD [ "npm", "run", "start" ]
