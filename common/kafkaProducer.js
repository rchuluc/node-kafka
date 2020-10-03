const {
    Kafka,
    logLevel,
    CompressionTypes
} = require('kafkajs')


class KafkaProducer {
    constructor({
        log,
        brokers,
        clientId,
        topic
    }) {
        this.broker = new Kafka({
            logLevel: logLevel[log],
            brokers,
            clientId
        })
        this.topic = topic
        this.producer = this.broker.producer()
    }

    async connect() {
        await this.producer.connect()
    }

    async sendMessage(message) {
        try {
            const _message = await this.producer.send({
                topic: this.topic,
                compression: CompressionTypes.GZIP,
                messages: [message]
            })
        } catch (error) {
            console.error('Failed to send message', error)
        } finally {
            this.producer.disconnect()
        }
    }
}

module.exports = KafkaProducer