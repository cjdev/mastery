#!/usr/bin/env bash
forever stop "mastery-web"
netstat -tulpn | grep ::91

