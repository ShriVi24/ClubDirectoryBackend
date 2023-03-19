const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    clubId: String,
});

module.exports = model('Admin', userSchema);