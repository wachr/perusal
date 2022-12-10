#!/bin/sh -e

if [ '-d' = ${1% } ]; then
  detachOpt='-d';
  shift;
fi

COMPOSE_PROFILES=$* docker compose -p perusal up $detachOpt
