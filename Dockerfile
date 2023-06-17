FROM node:18.12-alpine

RUN apk add tini

WORKDIR /app

COPY package.json package-lock.json ./

RUN yarn

COPY . .

ENV NODE_ENV production

RUN adduser -D node-user -G node

USER node-user

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "/app"]