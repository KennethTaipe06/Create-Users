const kafka = require('../config/kafkaConfig');
require('dotenv').config();

const consumer = kafka.consumer({ groupId: 'create-service-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC_PASS_RESET, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('Received message on pass.reset:', message.value.toString());
      // No hacer nada en consecuencia por ahora
    }
  });
};

run().catch(console.error);
