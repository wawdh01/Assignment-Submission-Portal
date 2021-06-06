const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    mbNum: {type: Number, required: true},
    standard: {type: Number, required: true},
    password: {type: String, required: true},
    login_type: {type: Number, required: true},
});

const User = mongoose.model("user", userSchema);

module.exports = User;
