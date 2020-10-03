const {
  Kafka,
  logLevel
} = require("kafkajs");
const {
  v4: uuid
} = require("uuid");

class KafkaConsumer {
  constructor({
    log,
    brokers,
    clientId,
    groupId = uuid(),
    topic,
    subscribeOptions
  }) {
    this.broker = new Kafka({
      logLevel: logLevel[log],
      brokers,
      clientId,
    });
    this.groupId = groupId;
    this.topic = topic;
    this.subscribeOptions = subscribeOptions;
    this.consumer = this.broker.consumer({
      groupId,
    });
  }

  async connect() {
    await this.consumer.connect();
  }

  async run(callback) {
    try {
      await this.consumer.subscribe({
        topic: this.topic,
        ...this.subscribeOptions,
      });

      await this.consumer.run({
        autoCommitThreshold: 1,
        eachMessage: async ({
          topic,
          partition,
          message
        }) => {
          callback(message);
        },
      });
    } catch (error) {
      console.log("Error processing message", error);
    }
  }
}

module.exports = KafkaConsumer;