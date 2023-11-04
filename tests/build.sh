#!/bin/sh
cd $(dirname $0)

docker image build -f ../Dockerfile -t node-hello-world .. $@