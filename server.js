// Modules
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// Config file
dotenv.config({ path: './config.env' });

// Database object
// Replace password word with database password from config file 
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// Connect to database with Mongoose
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(con => console.log('DB connection successful')); 

// Server connection
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});


