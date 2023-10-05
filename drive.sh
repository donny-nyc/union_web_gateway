#!/bin/bash

newOrderId=$(curl -s -X POST localhost:8080/orders/start-order | jq '.results.id' | tr -d \")

addToOrder=$(curl -s -X PUT localhost:8080/orders/$newOrderId/add-to-order -H 'Content-Type: application/json' -d '{ "productId": 1, "count": 1}')

echo $addToOrder

cancelResult=$(curl -s -X DELETE localhost:8080/orders/$newOrderId/cancel-order)

echo $cancelResult
