const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: { type: String, default: 'Anónimo' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Comment = mongoose.model('Comment', commentSchema);