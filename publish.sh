# Publish to docker hub

docker build . --tag romaintalentlayer/node-hello-world:$@
docker push romaintalentlayer/node-hello-world:$@