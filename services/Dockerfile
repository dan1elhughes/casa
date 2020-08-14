###
### This file is templates from /build-utils. Edits will be overwritten.
###
ARG IMG
FROM ${IMG} AS BUILD

ARG SERVICE

ENV npm_package_name=${SERVICE}
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY ${SERVICE}/dist .

EXPOSE 3000
CMD node index.js
