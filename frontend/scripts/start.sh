#!/usr/bin/env bash
PWD=$(pwd)
mkdir -p logs

yarn && \
yarn run build && \
forever start \
    --id "mastery-web" \
    -l "${PWD}/logs/m-w.log"  \
    -e "${PWD}/logs/m-w.err"  \
    -c "yarn run server"  \
    -a \
    ./

forever list

