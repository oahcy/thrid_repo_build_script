#!/bin/sh

chmod +x configure
dos2unix -f configure

chmod +x config.sub
dos2unix -f config.sub

chmod +x config.guess
dos2unix -f config.guess

dos2unix -f depcomp
dos2unix -f libtool
dos2unix -f ./bld/libtool
dos2unix -f missing
dos2unix -f install-sh
