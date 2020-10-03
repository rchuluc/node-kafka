const ip = require("ip");
const {
    v4: uuid
} = require("uuid");
const {
    commerce
} = require("faker");

const KafkaProducer = require("../common/kafkaProducer");

const host = process.env.HOST_IP || ip.address();
const producerConfig = {
    log: "INFO",
    clientId: `NEW_ORDER_${process.pid}`,
    topic: "ECOMMERCE_NEW_ORDER",
    brokers: [`${host}:9092`],
};

const producer = new KafkaProducer(producerConfig);

function generateMessage() {
    return {
        key: uuid(),
        value: JSON.stringify({
            order_id: uuid(),
            product_id: uuid(),
            product_name: commerce.productName(),
            buyer_id: uuid(),
            value: commerce.price(),
        }),
    };
}

async function main() {
    await producer.connect();
    await producer.sendMessage(generateMessage());
}

main();