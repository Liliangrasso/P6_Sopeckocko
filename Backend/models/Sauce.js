const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true},
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    heat: { type: Number, required: false },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    imageUrl: { type: String, required: false },
    mainPepper: { type: String, required: false },
    usersLiked: { type: Array, default: [0], required: true },
    usersDisliked: { type: Array, default: [0], required: true }
});

module.exports = mongoose.model('Sauce', sauceSchema);