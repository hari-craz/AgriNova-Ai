#!/usr/bin/env bash
set -euo pipefail

MONGODB_URI=${MONGODB_URI:-mongodb://mongodb:27017}

echo "Waiting for MongoDB at ${MONGODB_URI} ..."

retry=0
until node -e "(async ()=>{try{const m=require('mongodb');await m.MongoClient.connect(process.env.MONGODB_URI||'mongodb://mongodb:27017',{serverSelectionTimeoutMS:2000});console.log('ok');process.exit(0);}catch(e){process.exit(1)}})()"; do
  retry=$((retry+1))
  echo "Mongo not ready yet (attempt ${retry}/30). Sleeping 2s..."
  if [ ${retry} -ge 30 ]; then
    echo "MongoDB did not become ready in time, exiting."
    exit 1
  fi
  sleep 2
done

echo "MongoDB ready — starting server"
exec node server.js
