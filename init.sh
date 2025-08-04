#!/bin/bash

docker compose up --build -d

sleep 5

docker exec -it helfy-ticdc-1 /cdc cli changefeed create   --pd=http://pd:2379   --sink-uri="kafka://kafka:9092/tidb_cdc?protocol=canal-json"   --changefeed-id="kafka"

