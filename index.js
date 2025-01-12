const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const userRoutes = require("./routes/userRoutes");
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(morgan('combined')); // Registrar solicitudes HTTP
app.use(bodyParser.json({ limit: '10mb' }));

// Configuración de CORS
const corsOptions = {
  origin: '*', // Permitir todas las fuentes, puedes cambiar esto a una lista específica de dominios
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

app.use(helmet());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Users API",
      version: "1.0.0",
      description: "API para crear usuarios",
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message); // Registrar el mensaje del error
  console.error('Stack:', err.stack); // Registrar el stack trace del error
  if (err.type === 'entity.parse.failed') {
    res.status(400).send({ error: 'Bad Request: Invalid JSON' });
  } else {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
