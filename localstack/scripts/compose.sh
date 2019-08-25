#!/bin/bash

set -ex

PROJECT_ROOT=$(git rev-parse --show-toplevel)
PROJECT_NAME=$(basename $PROJECT_ROOT)

: ${COMPOSE_PROJECT_NAME:=$PROJECT_NAME}

COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME}_playground

COMPOSE_FILE=${PROJECT_ROOT}/localstack/docker-compose.yaml

if [ ! -f ${COMPOSE_FILE} ]; then
  echo "Warning: ${COMPOSE_FILE} is not a file"
  exit 0
fi

PROJECT_ROOT=${PROJECT_ROOT} docker-compose -p $COMPOSE_PROJECT_NAME -f $COMPOSE_FILE "$@"