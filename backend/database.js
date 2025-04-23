const mongoose = require('mongoose');

function DbConnect() {
    console.log('Attempting to connect to database...', process.env.DB_URL);
    const DB_URL = process.env.DB_URL;

    // Ensure DB_URL is defined
    if (!DB_URL) {
        console.error('Database URL is not defined in the environment variables.');
        return;
    }

    // Database connection
    mongoose.connect(DB_URL, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
    .then(() => {
        console.log('DB connected successfully...');
    })
    .catch(err => {
        console.error('DB connection error:', err);
    });
}

module.exports = DbConnect;