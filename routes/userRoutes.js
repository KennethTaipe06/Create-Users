const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const router = express.Router();

// Multer configuration for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *         - address
 *         - phone
 *         - semester
 *         - parallel
 *         - career
 *         - description
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         address:
 *           type: string
 *         phone:
 *           type: string
 *         image:
 *           type: string
 *           format: binary
 *         semester:
 *           type: string
 *         parallel:
 *           type: string
 *         career:
 *           type: string
 *         description:
 *           type: string
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               semester:
 *                 type: string
 *               parallel:
 *                 type: string
 *               career:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('Request to create a new user:', req.body);
    const { username, email, password, firstName, lastName, address, phone, semester, parallel, career, description } = req.body;
    let image;
    if (req.file) {
      image = { data: req.file.buffer, contentType: req.file.mimetype };
    } else {
      const defaultImagePath = path.join(__dirname, '../assets/user-icon.png');
      const defaultImage = fs.readFileSync(defaultImagePath);
      image = { data: defaultImage, contentType: 'image/png' };
    }
    console.log('Image data:', image);
    const user = new User({ username, email, password, firstName, lastName, address, phone, image, semester, parallel, career, description });
    await user.save();
    console.log('User created successfully:', user);
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
