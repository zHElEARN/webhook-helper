#!/bin/bash

# Stop on error
set -e

APP_NAME="webhook-helper"
TAG="latest"

# You can pass a registry as the first argument, e.g., ./scripts/build-docker.sh myregistry
# You can pass a tag as the second argument, e.g., ./scripts/build-docker.sh myregistry 1.1
REGISTRY=$1
TAG=${2:-latest}

if [ -z "$REGISTRY" ]; then
  IMAGE="$APP_NAME:$TAG"
  echo "No registry specified. Building image: $IMAGE"
  echo "Note: Multi-arch builds without --push will only be stored in the build cache."
  echo "To load into local docker daemon, you can typically only load one architecture at a time."
  
  # Build for both platforms
  docker buildx build --platform linux/amd64,linux/arm64 -t "$IMAGE" .
else
  IMAGE="$REGISTRY/$APP_NAME:$TAG"
  echo "Registry specified. Building and pushing image: $IMAGE"
  
  # Build and push to registry
  docker buildx build --platform linux/amd64,linux/arm64 -t "$IMAGE" --push .
fi
