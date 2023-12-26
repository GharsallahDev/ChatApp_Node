const mongoose = require('mongoose');
const config = require('../config.json');

const dbConfig = config.database;

const mongoURI = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;

mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

module.exports = db;