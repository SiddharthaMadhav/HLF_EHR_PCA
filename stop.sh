#!/bin/bash

COMPOSE_FILES="-f ./docker/docker-compose-hospital.yaml -f ./docker/docker-compose-chemist.yaml -f ./docker/docker-compose-insurance.yaml -f ./docker/docker-compose-pathology.yaml"
IMAGE_TAG=$IMAGETAG docker-compose ${COMPOSE_FILES} down --volumes --remove-orphans

rm -rf ./crypto-material/*
rm -rf ./system-genesis-block/*
rm -rf ./channel-artifacts/*