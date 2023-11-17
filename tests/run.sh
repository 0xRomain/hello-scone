#!/bin/sh
cd $(dirname $0)

IEXEC_OUT=/tmp/iexec_out
rm -rf $IEXEC_OUT
mkdir -p $IEXEC_OUT

IEXEC_IN=/tmp/iexec_in

docker run --rm \
        -e IEXEC_OUT=/iexec_out \
        -e IEXEC_IN=/iexec_in \
        -e IEXEC_DATASET_FILENAME=data.zip \
        -v $IEXEC_OUT:/iexec_out \
        -v $IEXEC_IN:/iexec_in \
        node-hello-world $@

echo
find $IEXEC_OUT