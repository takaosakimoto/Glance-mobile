#!/usr/bin/env bash

echo Building as "$USER" groups $(groups)

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker build \
    --tag=jond3k/glance-app:latest \
    --build-arg "IONIC_USE_PROXY=${IONIC_USE_PROXY:-false}" \
    --build-arg "GLANCE_API=${GLANCE_API:?required}" \
    --build-arg "IONIC_APP_NAME=${IONIC_APP_NAME:?required}" \
    --build-arg "IONIC_APP_ID=${IONIC_APP_ID:?required}" \
    $DIR

