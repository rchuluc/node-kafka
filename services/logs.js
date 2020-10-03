const ip = require("ip");
const KafkaConsumer = require("../common/kafkaConsumer");

const host = process.env.HOST_IP || ip.address();
const consumerConfig = {
    log: "INFO",
    clientId: `LOGGER_${process.pid}`,
    topic: /ECOMMERCE_.*/,
    brokers: [`${host}:9092`],
    groupId: 'LOG',
    subscriberOptions: {
        fromBeginning: false,
    },
};

const consumer = new KafkaConsumer(consumerConfig);

async function logMessages(message) {
    console.log('\n')
    console.log('--- Recived Message ---')
    console.log(message.value.toString())
    console.log('----------------------- \n')
}

async function main() {
    await consumer.connect();
    await consumer.run(logMessages);
}

main()