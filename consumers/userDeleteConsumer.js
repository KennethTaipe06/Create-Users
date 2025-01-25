const kafka = require('../config/kafkaConfig');
const crypto = require('crypto');
const User = require('../models/User');
require('dotenv').config();

const consumer = kafka.consumer({ groupId: 'user-service-group' });

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');

const decrypt = (text) => {
  let iv = Buffer.from(text.iv, 'hex');
  let encryptedText = Buffer.from(text.encryptedData, 'hex');
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

const run = async () => {
  try {
    await consumer.connect();
    console.log('Kafka consumer connected');
    await consumer.subscribe({ topic: process.env.KAFKA_TOPIC_DELETE, fromBeginning: true });
    console.log('Subscribed to topic:', process.env.KAFKA_TOPIC_DELETE);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log('Received message:', message.value.toString());
        const encryptedMessage = JSON.parse(message.value.toString());
        console.log('Encrypted message:', encryptedMessage);
        const decryptedMessage = decrypt(encryptedMessage);
        console.log('Decrypted message:', decryptedMessage);
        const { id } = JSON.parse(decryptedMessage);

        console.log('User ID to delete:', id);

        const user = await User.findByIdAndDelete(id);
        if (user) {
          console.log('User deleted successfully:', user);
        } else {
          console.log('User not found:', id);
        }
      }
    });
  } catch (error) {
    console.error('Error in Kafka consumer:', error);
  }
};

run().catch(console.error);

module.exports = { run };
