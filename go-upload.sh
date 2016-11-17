#!/usr/bin/env bash

CMD="ionic upload --release --deploy production --note ${GO_PIPELINE_LABEL:?required} -e ${IONIC_EMAIL:?required} -p ${IONIC_PASSWORD:?required}"

docker push jond3k/glance-app:latest

docker run \
    --rm \
    -v ~/.ionic:/root/.ionic \
    -e "IONIC_USE_PROXY=${IONIC_USE_PROXY}" \
    -e "GLANCE_API=${GLANCE_API:?required}" \
    -e "IONIC_APP_NAME=${IONIC_APP_NAME:?required}" \
    -e "IONIC_APP_ID=${IONIC_APP_ID:?required}" \
    jond3k/glance-app:latest \
    /bin/bash -c "$CMD"
