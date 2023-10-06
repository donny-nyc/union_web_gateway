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

function removeFromOrder() {
  HOST="localhost"
  PORT=8080

  newOrderId=$1
  productId=$2

  echo $(curl -s -X DELETE $HOST:$PORT/orders/$newOrderId/remove-item/$productId -H 'Content-Type: application/json')
}

function increment() {
  HOST="localhost"
  PORT=8080

  newOrderId=$1
  productId=$2

  echo $(curl -s -X PUT $HOST:$PORT/orders/$newOrderId/increment/$productId -H 'Content-Type: application/json')
}

function decrement() {
  HOST="localhost"
  PORT=8080

  newOrderId=$1
  productId=$2

  echo $(curl -s -X PUT $HOST:$PORT/orders/$newOrderId/decrement/$productId -H 'Content-Type: application/json')
}

newOrderId=$(startNewOrder)

add=$(addToOrder $newOrderId 1 1)

echo $add

getOrder=$(curl -s -X GET localhost:8080/orders/$newOrderId/items)

echo "getOrder"
echo $getOrder

increment=$(increment $newOrderId 1)

getOrder=$(curl -s -X GET localhost:8080/orders/$newOrderId/items)

echo "getOrder"
echo $getOrder

decrement=$(decrement $newOrderId 1)

getOrder=$(curl -s -X GET localhost:8080/orders/$newOrderId/items)

echo "getOrder"
echo $getOrder

remove=$(removeFromOrder $newOrderId 1)

echo $remove

getOrder=$(curl -s -X GET localhost:8080/orders/$newOrderId/items)

echo "getOrder"
echo $getOrder

cancelResult=$(curl -s -X DELETE localhost:8080/orders/$newOrderId/cancel-order)

echo $cancelResult

status=$(curl -s -X GET localhost:8080/orders/$newOrderId/status)

echo $status
