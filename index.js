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
const port = process.env.PORT || 3000; // Read the port from the .env file

// Middleware
app.use(morgan('combined')); // Log HTTP requests
app.use(bodyParser.json({ limit: '10mb' }));

// CORS configuration
const corsOptions = {
  origin: '*', // Allow all origins, you can change this to a specific list of domains
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
    useUnifiedTopology: true
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
      description: "API to create users",
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Importar y ejecutar los consumidores
require('./consumers/userDeleteConsumer');
require('./consumers/userCreatedConsumer');
require('./consumers/userEditConsumer');
require('./consumers/passResetConsumer');

// Routes
app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message); // Log the error message
  console.error('Stack:', err.stack); // Log the error stack trace
  if (err.type === 'entity.parse.failed') {
    res.status(400).send({ error: 'Bad Request: Invalid JSON' });
  } else {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
