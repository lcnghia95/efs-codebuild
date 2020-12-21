FROM gogojungle/node:10.16.0 AS builder

WORKDIR ${GOGO_WD}

COPY package.json yarn.lock ./
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && yarn --prod \
    && apk del .gyp

COPY vi/package.json vi/yarn.lock ./vi/
RUN cd vi && yarn --prod

FROM gogojungle/node:10.16.0

WORKDIR ${GOGO_WD}

COPY --from=builder ${GOGO_WD}/node_modules ./node_modules
COPY --from=builder ${GOGO_WD}/vi/node_modules ./vi/node_modules

EXPOSE 7994

COPY vi/docker/start.sh /start.sh
COPY vi/docker/cp-bundle.sh ${GOGO_WD}/cp-bundle.sh
RUN chmod +x /start.sh
RUN chmod +x ${GOGO_WD}/cp-bundle.sh

CMD [ "/start.sh" ]

