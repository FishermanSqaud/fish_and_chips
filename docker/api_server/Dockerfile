FROM node:15.2.1-alpine3.10

MAINTAINER yaechanKim <burgund32@gmail.com>

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY ./api_server/ .

RUN npm install

RUN apk update

RUN apk add --no-cache git

RUN git clone https://github.com/eficode/wait-for.git

ENV NODE_TLS_REJECT_UNAUTHORIZED '0'

EXPOSE 8080

CMD ["/bin/sh","-c", "./wait-for/wait-for -t 60 database:3306 -- node app.js"]
