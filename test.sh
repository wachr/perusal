#!/bin/sh -e
docker compose --project-name perusal run -it --rm --name test-runner dev-server test $*
