const mongoose = require('mongoose');

const questionnaireResponseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clan: { type: String, required: true },
    responses: { type: Map, of: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuestionnaireResponse', questionnaireResponseSchema);
