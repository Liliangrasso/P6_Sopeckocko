/*** IMPORTATIONS ****/
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const likeSchema = mongoose.Schema({
    //Récupération de l'id utilisateur qui like
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    //Récupération de l'id de la sauce qui reçoi un like
    sauceId: {
        type: Schema.Types.ObjectId,
        ref: 'Sauce'
    },
    like: {
        type: Number, required: false
    }
});

likeSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Like', likeSchema);