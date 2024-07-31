const mongoose = require('mongoose');

const questionnaireResponseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clan: {
        type: String,
        required: true
    },
    responses: {
        type: Map,
        of: String,
        required: true
    }
});

const QuestionnaireResponse = mongoose.model('QuestionnaireResponse', questionnaireResponseSchema);

module.exports = QuestionnaireResponse;
