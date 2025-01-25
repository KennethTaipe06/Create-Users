const express = require('express');
const cors = require('cors');
const userController = require('../controllers/userController');

const router = express.Router();

// Habilitar CORS
router.use(cors());

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
 *         application/json:
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
router.post('/', userController.createUser);

module.exports = router;
