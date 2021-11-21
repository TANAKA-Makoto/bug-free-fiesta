#!/bin/bash
docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli generate \
    -i /local/raas-front-OAS/reference/RaaSWebAPIv2.yaml \
    -g typescript-node \
    -o /local/src/@type/OAStype
