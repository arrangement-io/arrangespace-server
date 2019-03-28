const helmet = require('helmet');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const authMiddleware = require('./utils/auth');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// add some security-related headers to the response
app.use(helmet());
app.use(authMiddleware);

// Import routes here
require('./routes/session_routes')(app);
require('./routes/user_routes')(app);
require('./routes/arrangement_routes')(app);

let db = require('./db/database_mongo');

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Server listening on port ${port}!`);
  let mongoUri = process.env.MONGODB_URI;
  db.connect(mongoUri);
});

module.exports = app;
