const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    project_id: process.env.PROJECT_ID,
    private_key: process.env.PRIVATE_KEY,
    client_email: process.env.CLIENT_EMAIL,
};