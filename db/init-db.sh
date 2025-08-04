#!/bin/sh
set -e

# Wait for TiDB to be ready
until mysql -h tidb -P 4000 -u root -e "SELECT 1"; do
  echo "Waiting for TiDB..."
  sleep 2
done

# Run your SQL
mysql -h tidb -P 4000 -u root < /docker-entrypoint-initdb.d/db.sql
