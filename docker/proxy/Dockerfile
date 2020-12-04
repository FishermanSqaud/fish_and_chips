# Build React app
FROM node:12 as react-builder

WORKDIR /usr/src/web

ENV PATH /usr/src/web/node_modules/.bin:$PATH

COPY ./proxy/web/package*.json /usr/src/web/

RUN npm install

COPY ./proxy/web /usr/src/web

COPY ./.env /usr/src/web/

RUN npm run build

# Nginx Build
From nginx:alpine

# Erase Default config
RUN rm -rf /etc/nginx/conf.d

COPY ./proxy/conf /etc/nginx

WORKDIR /usr/share/nginx/html

COPY --from=react-builder /usr/src/web/build /usr/share/nginx/html

EXPOSE 80

CMD ["/usr/sbin/nginx"]
