const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    discriminator: { type: String, required: true },
    role: { type: String, default: 'user' } // Le rôle par défaut est 'user'
});

module.exports = mongoose.model('User', userSchema);
