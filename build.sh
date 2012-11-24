#!/bin/bash

VER=$1
if [ "$VER" = "" ]
then
    echo -n "Specify a version: "
    read VER
fi
cp -R src build
cd build
sed -i "" "s/\$VERSION/$VER/" config.xml
zip -r ../speediegram-$VER.oex *
rm -r ../build