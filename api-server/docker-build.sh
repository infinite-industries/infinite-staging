#!/usr/bin/env bash

# NOTE: using just is an alternative to this script:
# just tag=local name=infinite-industries/api-server build

set -e

tag="${1:-local}"

script_name="docker-build"
container_name="infinite-industries/api-server"

echo "$script_name: building $container_name for tag $tag"

docker build -t "$container_name:$tag" .

echo "$script_name: finished building $container_name for tag $tag"

set +e
