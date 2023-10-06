#!/bin/bash

function startNewOrder() {
  HOST="localhost"
  PORT=8080

  newOrderId=$(curl -s -X POST $HOST:$PORT/orders/start-order | jq '.results.id' | tr -d \")

  echo $newOrderId
}

function addToOrder() {
  HOST="localhost"
  PORT=8080

  newOrderId=$1
  productId=$2
  count=$3

  echo  '{ "productId": "'$productId'", "count": "'$count'"}'

  echo $(curl -s -X PUT $HOST:$PORT/orders/$newOrderId/add-to-order -H 'Content-Type: application/json' -d '{ "productId": "'$productId'", "count": "'$count'"}')

}

newOrderId=$(startNewOrder)

add=$(addToOrder $newOrderId 1 1)

echo $add

getOrder=$(curl -s -X GET localhost:8080/orders/$newOrderId/items)

echo "getOrder"
echo $getOrder

cancelResult=$(curl -s -X DELETE localhost:8080/orders/$newOrderId/cancel-order)

echo $cancelResult

status=$(curl -s -X GET localhost:8080/orders/$newOrderId/status)

echo $status
