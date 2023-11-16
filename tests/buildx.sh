#!/bin/sh
cd $(dirname $0)

docker buildx build --platform linux/arm64 -f ../Dockerfile -t node-hello-world .. $@