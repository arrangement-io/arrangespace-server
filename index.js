const helmet = require('helmet');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const authMiddleware = require('./utils/auth');
const validator = require('express-validator');
let path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(validator());

// add some security-related headers to the response
app.use(helmet());
app.use(authMiddleware);
app.use(express.static('doc'));

// Import routes here
require('./routes/session_routes')(app);
require('./routes/user_routes')(app);
require('./routes/arrangement_routes')(app);

app.get('/docs', (request, response) => {
  response.sendFile(path.join(__dirname, '/doc/index.html'));
});

let db = require('./db/database_mongo');

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Server listening on port ${port}!`);
  db.connect(process.env.MONGODB_URI);
});

module.exports = app;
