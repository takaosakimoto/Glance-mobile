FROM node:6

# Install build dependencies
RUN npm install -g cordova@6.2.0 gulp@3.9.1 typescript@1.8.10 typings@1.0.5 ionic@1.7.15

# Working directory
ENV BUILD_DIR /var/build/
RUN mkdir -p $BUILD_DIR
WORKDIR $BUILD_DIR

# Install node.js dependencies
COPY package.json $BUILD_DIR
RUN npm install

# Install typescript dependencies
COPY typings.json $BUILD_DIR
RUN typings install

# Load source
COPY go-lab.sh tsconfig.json config.xml gulpfile.js $BUILD_DIR
COPY hooks $BUILD_DIR/hooks
COPY resources $BUILD_DIR/resources
COPY app $BUILD_DIR/app
COPY www $BUILD_DIR/www
COPY configure.sh $BUILD_DIR/

# Build config
ARG IONIC_USE_PROXY
ARG GLANCE_API
ARG IONIC_APP_NAME
ARG IONIC_APP_ID
ENV IONIC_USE_PROXY ${IONIC_USE_PROXY:-false}
ENV GLANCE_API ${GLANCE_API}
ENV IONIC_APP_NAME ${IONIC_APP_NAME}
ENV IONIC_APP_ID ${IONIC_APP_ID}

RUN gulp build --release
