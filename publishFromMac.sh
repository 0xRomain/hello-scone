# Publish to docker hub

docker buildx build --platform linux/amd64 . --tag romaintalentlayer/node-hello-world:$@
# docker build --platform linux/amd64 . --tag romaintalentlayer/node-hello-world:$@
docker push romaintalentlayer/node-hello-world:$@