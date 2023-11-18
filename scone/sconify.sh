#!/bin/bash

# Declare the app entrypoint
ENTRYPOINT="node /app/dist/app.js"

# Declare image related variables
IMG_NAME=tee-scone-node-hello-world
IMG_FROM=romaintalentlayer/node-hello-world:1.0.8
IMG_TO=romaintalentlayer/${IMG_NAME}:1.0.8

# Do we need that ? 
docker pull registry.scontain.com/sconecuratedimages/node:16-alpine3.15

# Run the sconifier to build the TEE image based on the non-TEE image
docker run -it --rm \
            -v /var/run/docker.sock:/var/run/docker.sock \
            registry.scontain.com/sconecuratedimages/iexec-sconify-image:5.9.0-rc-m1602 \
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
            && echo "application mrenclave.fingerprint is $(docker run --rm -e SCONE_HASH=1 ${IMG_TO})"