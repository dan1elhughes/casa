# ARG IMG=arm32v7/node:13-slim
ARG IMG=node:13
FROM ${IMG} AS BUILD

ARG DIR=service.ping
ENV ENV_DIR=$DIR

WORKDIR /usr/src/app

COPY ./build.sh ./
COPY ./yarn.lock ./
COPY ./lib.* ./
COPY ./${DIR} ./${DIR}
RUN yarn install --production --frozen-lockfile
RUN yarn workspace ${ENV_DIR} build

COPY . .

EXPOSE 3000

CMD ["node", "dist/index.js"]
