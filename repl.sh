#!/bin/sh -e

docker compose --project-name perusal run -it --rm --name node-repl  \
  --env='NODE_PATH:./node_modules' --entrypoint="node" dev-server
