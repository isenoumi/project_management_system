#!/bin/bash

function echo_info() {
  message=$1
  echo
  echo "================================================================================"
  echo "$message"
  echo "================================================================================"
  echo
}

function init() {
  echo_info "Init environment."
  mkdir -p ~/.kube && cd deploy && cp config ~/.kube && chmod +x kubectl && \cp kubectl /usr/bin
}

function build() {
  echo_info "Build project code."
  npm config set registry https://registry.npm.taobao.org
  npm install -g pnpm
  pnpm install
  npm run build
}

function calculate_image_tag() {
  current_image_tag="$CI_COMMIT_SHORT_SHA"
  if [[ $(expr match "$CI_COMMIT_REF_NAME" 'release/*') != 0 ]]; then
    current_release_version=$(echo "$CI_COMMIT_REF_NAME" | sed 's/release\///')
    current_image_tag="${current_release_version}-release"
  fi
  export IMAGE_TAG="$current_image_tag"
}

function publish() {
  echo_info "Build docker image and push to registry.(IMAGE_TAG=$IMAGE_TAG)"
  calculate_image_tag

  docker login -u "$ARTIFACTORY_USERNAME" -p "$ARTIFACTORY_PASSWORD" "$ARTIFACTORY_REGISTRY"

  mv dist deploy/html
  cd deploy/ || exit 1

  ls html

  image=$ARTIFACTORY_REGISTRY/cestech/oms-web:$IMAGE_TAG
  echo_info "image=${image}"
  docker build -t $image .
  docker push $image
}

function deploy() {
  init

  calculate_image_tag

  echo_info "Deploying service to $ENVIRONMENT"
  if [ ! $(kubectl get po -A | grep "oms-web") ]; then
    sed -i "s/IMAGE_TAG/${IMAGE_TAG}/g" oms-web.yaml
    kubectl create -f oms-web.yaml
  else
    kubectl set image deployments/oms-web oms-web=$ARTIFACTORY_REGISTRY/cestech/oms-web:$IMAGE_TAG
  fi
}

function main() {
  if [ "$1" == "build" ]; then
    build
  elif [ "$1" == "publish" ]; then
    publish
  elif [ "$1" == "deploy" ]; then
    deploy
  fi
}

set -e
main $1 $2
