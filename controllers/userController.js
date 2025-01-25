const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { connectProducer, disconnectProducer, sendMessage } = require('../producers/kafkaProducer');
require('dotenv').config();

exports.createUser = async (req, res) => {
  try {
    await connectProducer();
    console.log('Request to create a new user:', req.body);
    const user = new User(req.body);
    await user.save();
    console.log('User saved to database:', user);

    await sendMessage(process.env.KAFKA_TOPIC, { id: user._id, ...user.toObject() });
    console.log('Message sent to Kafka topic:', process.env.KAFKA_TOPIC);

    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).send({ error: error.message });
  } finally {
    await disconnectProducer();
  }
};
