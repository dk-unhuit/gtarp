const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionnaireResponseSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        required: true
    },
    clan: {
        type: String,
        required: true
    },
    discordId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    responses: [
        {
            question: {
                type: String,
                required: true
            },
            answer: {
                type: String,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('QuestionnaireResponse', QuestionnaireResponseSchema);
