#!/bin/bash

echo "cleaning extended attribute files..."
find . -name "._*" -type f -delete

echo "building and starting containers..."
docker compose up --build
