FROM gogojungle/node:10.16.0 AS builder

## current path as root
# Create app directory
WORKDIR ${GOGO_WD}

# --no-cache: download package index on-the-fly, no need to cleanup afterwards
# --virtual: bundle packages, remove whole bundle at once, when done
COPY package.json yarn.lock ./
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && yarn --prod \
    && apk del .gyp

# install app dependencies
COPY ja/package.json ja/yarn.lock ./ja/
RUN cd ja && yarn --prod

FROM gogojungle/node:10.16.0
WORKDIR ${GOGO_WD}

COPY --from=builder ${GOGO_WD}/node_modules ./node_modules
COPY --from=builder ${GOGO_WD}/ja/node_modules ./ja/node_modules

EXPOSE 7990

COPY ja/docker/start.sh /start.sh
COPY ja/docker/cp-bundle.sh ${GOGO_WD}/cp-bundle.sh
RUN chmod +x /start.sh
RUN chmod +x ${GOGO_WD}/cp-bundle.sh

CMD [ "/start.sh" ]
