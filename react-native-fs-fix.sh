#!/bin/bash

FILE="node_modules/react-native-fs/RNFSManager.m"

if [ ! -f "$FILE" ]; then
  echo "Error: File not found: $FILE"
  exit 1
fi

# Use sed to perform the replacement
sed -i.bak 's/length: (NSInteger \*)length/length: (NSInteger)length/; s/position: (NSInteger \*)position/position: (NSInteger)position/' "$FILE"

echo "Patch applied successfully to $FILE"