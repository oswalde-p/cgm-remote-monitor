FROM node:10-alpine


RUN apk add --update python
RUN apk add --update make
RUN apk add --update g++

RUN npm install -g nodemon

RUN mkdir -p /opt/app
ADD . /opt/app
WORKDIR /opt/app

RUN chown -R node:node /opt/app
USER node

RUN npm install

EXPOSE 1337

CMD ["nodemon", "server.js"]
