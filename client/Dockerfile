# stage 1 building react application

FROM node:22-alpine AS builder

WORKDIR /client

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# stage 2 server the react application

FROM nginx:stable-alpine

COPY --from=builder /client/dist usr/share/nginx/html

EXPOSE 80

CMD [ "nginx" "-g" "deamonoff;" ]



