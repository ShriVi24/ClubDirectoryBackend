const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    clubId: String,
    roll: String,
});

module.exports = model('User', userSchema);