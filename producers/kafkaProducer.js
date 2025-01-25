const { Kafka, Partitioners } = require('kafkajs');
const crypto = require('crypto');
require('dotenv').config();

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [process.env.KAFKA_BROKER],
  createPartitioner: Partitioners.LegacyPartitioner
});
const producer = kafka.producer();

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');

const encrypt = (text) => {
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
};

const connectProducer = async () => await producer.connect();
const disconnectProducer = async () => await producer.disconnect();

const sendMessage = async (topic, message) => {
  const encryptedMessage = encrypt(JSON.stringify(message));
  await producer.send({
    topic: topic,
    messages: [{ value: JSON.stringify(encryptedMessage) }]
  });
};

module.exports = { connectProducer, disconnectProducer, sendMessage };
