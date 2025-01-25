const { Kafka } = require('kafkajs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Configuración de Kafka
const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [process.env.KAFKA_BROKER]
});
const consumer = kafka.consumer({ groupId: 'user-service-group' });

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // Clave estática
const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex'); // IV estático

const decrypt = (text) => {
  let iv = Buffer.from(text.iv, 'hex');
  let encryptedText = Buffer.from(text.encryptedData, 'hex');
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC_DELETE, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('Received message:', message.value.toString());
      const encryptedMessage = JSON.parse(message.value.toString());
      console.log('Encrypted message:', encryptedMessage);
      const decryptedMessage = decrypt(encryptedMessage);
      console.log('Decrypted message:', decryptedMessage);
      const { id } = JSON.parse(decryptedMessage);

      console.log('User ID to delete:', id);

      await User.findByIdAndDelete(id);
      console.log('User deleted successfully');
    }
  });
};

run().catch(console.error);
