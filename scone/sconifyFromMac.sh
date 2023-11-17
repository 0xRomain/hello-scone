#!/bin/bash
# !NOT WORKING => sconify has to be done from amd64 architecture

# Declare the app entrypoint
ENTRYPOINT="node /app/dist/app.js"

# Declare image related variables
IMG_NAME=tee-scone-node-hello-world
IMG_FROM=romaintalentlayer/node-hello-world:1.0.6
IMG_TO=romaintalentlayer/${IMG_NAME}:1.0.6-test

# docker pull registry.scontain.com/sconecuratedimages/node:14.4.0-alpine3.11

# Run the sconifier to build the TEE image based on the non-TEE image
docker run --platform=linux/amd64 -it --rm \
            -v /var/run/docker.sock:/var/run/docker.sock \
            docker.io/luiscarlosiexec/iexec-sconify-image:5.7.5-v12 \
            sconify_iexec \
            --name=${IMG_NAME} \
            --from=${IMG_FROM} \
            --to=${IMG_TO} \
            --binary-fs \
            --fs-dir=/app \
            --host-path=/etc/hosts \
            --host-path=/etc/resolv.conf \
            --binary=/usr/local/bin/node \
            --heap=1G \
            --dlopen=1 \
            --no-color \
            --verbose \
            --command=${ENTRYPOINT} \
            && echo -e "\n------------------\n" \
            && echo "successfully built TEE docker image => ${IMG_TO}" \
            && echo "application mrenclave.fingerprint is $(docker run --platform=linux/amd64 --rm -e SCONE_HASH=1 ${IMG_TO})"