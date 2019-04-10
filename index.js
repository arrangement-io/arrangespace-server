'use strict';
const helmet = require('helmet');
const express = require('express');
const app = express();
module.exports = app;
const bodyParser = require('body-parser');
const authMiddleware = require('./utils/auth');
const log = require('./utils/logger');
const core = require('./api/internal/core');
let path = require('path');
let db = require('./db/database_mongo');

app.use(log.requestLogger);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Add some security-related headers to the response
app.use(helmet());
app.use(authMiddleware);
app.use(express.static('doc'));

// Import routes here
require('./routes/session_routes')(app);
require('./routes/user_routes')(app);
require('./routes/arrangement_routes')(app);
require('./routes/cluster_routes')(app);
require('./routes/health_routes')(app);

app.get('/docs', (request, response) => {
  response.sendFile(path.join(__dirname, '/doc/index.html'));
});

// Add error logger after all middleware and routes
app.use(log.errorLogger);

const port = process.env.PORT || 3000;
app.on('ready', function () {
  app.listen(port, function () {
    core.log(`Server listening on port ${port}!`);
    app.emit('started');
  });
});

db.connect();
