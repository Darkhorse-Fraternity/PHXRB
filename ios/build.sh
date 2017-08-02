#!/bin/sh
export LC_ALL="en_US.UTF-8"

#
# usage:
# > sh build.sh 1.0.0 200
#

# versionNumber=$1 # 1.0.0
# buildNumber=$2 # 2000
#
 rm -rf build
#
# basicLanes="InHouse"
# #basicLanes="AdHoc AppStore Develop InHouse"
# for laneName in $basicLanes
# do
#     fastlane $laneName version:$versionNumber build:$buildNumber
# done
#
# #channelIds="fir 91"
# channelIds="fir"
# for channelId in $channelIds
# do
#     fastlane Channel version:$versionNumber build:$buildNumber channel_id:$channelId
# done



projectScheme="PHXRB"


fir build_ipa ${WORKSPACE}/$projectScheme.xcworkspace  -w -S $projectScheme  -p -V
