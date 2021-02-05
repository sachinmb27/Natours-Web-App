// Modules
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel.js');

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

// Read JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// Import data into DB
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data successfully imported!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
}

// Delete all existing collection from DB
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
}

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] == '--delete') {
    deleteData();
}
