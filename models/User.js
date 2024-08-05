const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    discordId: String,
    role: {
        type: String,
        enum: ['user', 'admin', 'owner'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['attente', 'accepté', 'refusé'],
        default: 'attente'
    },
    clan: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
