const kafka = require('../config/kafkaConfig');
require('dotenv').config();

const consumer = kafka.consumer({ groupId: 'user-service-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('Received message on user.created:', message.value.toString());
      // No hacer nada en consecuencia por ahora
    }
  });
};

run().catch(console.error);
