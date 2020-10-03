require('dotenv').config()
const ip = require("ip");
const delay = require('../utils/delay')
const {
    v4: uuid
} = require("uuid");
const {
    internet
} = require("faker");

const KafkaProducer = require("../common/kafkaProducer");
const KafkaConsumer = require("../common/kafkaConsumer");

const PROCESSING_TIME = process.env.FRAUD_DETECTION_TIME || 2000

const host = process.env.HOST_IP || ip.address();
const producerConfig = {
    log: "INFO",
    clientId: `FRAUD_DETECTOR_${process.pid}`,
    topic: "ECOMMERCE_SEND_EMAIL",
    brokers: [`${host}:9092`],
};

const consumerConfig = {
    log: "INFO",
    clientId: `FRAUD_DETECTOR_${process.pid}`,
    topic: "ECOMMERCE_NEW_ORDER",
    brokers: [`${host}:9092`],
    groupId: 'FRAUD_DETECTOR',
    subscriberOptions: {
        fromBeginning: true,
    },
};

const producer = new KafkaProducer(producerConfig);
const consumer = new KafkaConsumer(consumerConfig);

async function main() {
    await consumer.connect()
    await consumer.run(processOrder)
}


async function processOrder(message) {
    const {
        timestamp
    } = message
    const {
        order_id,
        buyer_id,
        value,
        product_name
    } = JSON.parse(message.value)

    console.log('--- Processing order ---')
    await delay(PROCESSING_TIME)

    let email
    const result = (Math.random() * 10) % 2 > 1
    if (result) {
        aproveOrder({
            order_id,
            buyer_id,
            value,
            timestamp
        })
        email = generateEmail({
            email: internet.email(),
            subject: 'Your order was aproved!',
            body: `Hello, ${internet.userName()} \n Order details: \n ${product_name} \n $${value} \n Thanks for your purchase!`
        })
    } else {
        rejectOrder({
            order_id,
            buyer_id,
            value,
            timestamp
        })

        email = generateEmail({
            email: internet.email(),
            subject: 'Your order was rejected :( ',
            body: `Hello, ${internet.userName()} \n your order was rejected due a posible fraud, check your account for more details`
        })
    }

    await producer.connect()
    await producer.sendMessage(email)
}

function aproveOrder({
    order_id,
    buyer_id,
    value,
    timestamp
}) {
    console.log('\n')
    console.log('--- Aproved order ---')
    console.log('Order: ', order_id)
    console.log('Buyer: ', buyer_id)
    console.log('value: ', value)
    console.log('---------------------- \n\n')
}

function rejectOrder({
    order_id,
    buyer_id,
    value,
    timestamp
}) {
    console.log('\n')
    console.log('--- Rejected order ---')
    console.log('Order: ', order_id)
    console.log('Buyer: ', buyer_id)
    console.log('value: ', value)
    console.log('---------------------- \n\n')
}

function generateEmail({
    email,
    subject,
    body
}) {
    return {
        key: uuid(),
        value: JSON.stringify({
            email,
            subject,
            body
        }),
    };
}

main()