# Node Kafka simple example

NodeJS ecommerce proof of concept example using Apache Kafka.

## Application flow

1. A new order is created.
2. The fraud detector do a verification to prevent payment frauds, it take some time to complete.
3. An email is sent to buyer informing if the order was accepted or rejected by fraud detector.
4. All messages are recived by log service.

NOTE: none of services above do a real job, is just a couple `console.log's`.

## Kafka

In this project, are two topics ECOMMERCE_NEW_ORDER and ECOMMERCE_SEND_EMAIL. To add more topics add a new value to `KAFKA_CREATE_TOPICS` in `docker-compose.yml` separed by comma, the topic follow the `NAME:PARTITIONS:REPLICAS:CLEANUP_POLICY` pattern.

The messages are serialized in JSON format.

More configurations are available [here](https://github.com/wurstmeister/kafka-docker).

The communication between NodeJS and Kafka is provided by [kafkaJS](https://kafka.js.org/).

## Runinng

To run Kafka and Zookeeper run:

```sh
export HOST_IP=$(ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1)
docker-compose up
```

Then, execute one service in each terminal

```sh
npm run log
npm run email
npm run fraud
```

To make an Order run:

```sh
npm run order
```

To change the fraud detection processing time create a `.env` file at project root folder, and add a `FRAUD DETECTION TIME` key in milliseconds, the default value is 2000ms (2 seconds).
