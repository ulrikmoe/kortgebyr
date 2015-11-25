#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
mount -t ramfs -o mode=777,uid=$UID,gid=$GROUPS ramfs ${DIR}/www