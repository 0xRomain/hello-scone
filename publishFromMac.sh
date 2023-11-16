# Publish to docker hub

docker buildx build --platform linux/arm64 . --tag romaintalentlayer/node-hello-world:$@
docker push romaintalentlayer/node-hello-world:$@