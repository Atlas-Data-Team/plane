#!/bin/bash

set -e  # fail là dừng luôn

echo "🚀 Building Plane images..."


docker build -t mds/plane-backend -f apps/api/Dockerfile.api apps/api
docker build -t mds/plane-frontend -f apps/web/Dockerfile.web  .

echo "✅ Done!"
