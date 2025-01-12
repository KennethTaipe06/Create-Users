const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const User = require('../models/User');

const router = express.Router();

// Configuración de multer para la carga de archivos en memoria
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
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario
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
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('Solicitud para crear un nuevo usuario:', req.body);
    const { username, email, password, firstName, lastName, address, phone } = req.body;
    const image = req.file ? { data: req.file.buffer, contentType: req.file.mimetype } : null;
    console.log('Datos de la imagen:', image);
    const user = new User({ username, email, password, firstName, lastName, address, phone, image });
    await user.save();
    console.log('Usuario creado exitosamente:', user);
    res.status(201).send({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
