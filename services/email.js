const ip = require("ip");
const KafkaConsumer = require("../common/kafkaConsumer");

const host = process.env.HOST_IP || ip.address();
const consumerConfig = {
    log: "INFO",
    clientId: `EMAIL_${process.pid}`,
    topic: "ECOMMERCE_SEND_EMAIL",
    brokers: [`${host}:9092`],
    groupId: 'EMAIL',
    subscriberOptions: {
        fromBeginning: true,
    },
};

const consumer = new KafkaConsumer(consumerConfig);

async function sendEmail(message) {
    const {
        email,
        subject,
        body
    } = JSON.parse(message.value)

    console.log('--- Sending email ---')
    console.log('to: ', email)
    console.log('subject: ', subject)
    console.log(body)
    console.log('---------------------- \n\n')
}

async function main() {
    await consumer.connect();
    await consumer.run(sendEmail);
}

main()