const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getAllStuff = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};
/*
exports.like = (req, res, next) => {
    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id
    //let isLiked = false;
    switch (like) {
        case 1:
            if (like === 1) {
                //isLiked = true
                Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 } })
                    .then(() => res.status(200).json({ message: `Like` }))
                    .catch((error) => res.status(400).json({ error }))
            }
            break;
        case 0:
            if (like === 0) {
                Sauce.findOne({ _id: sauceId })
                    .then((sauce) => {
                        if (sauce.usersLiked.includes(userId)) {
                            Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
                                .then(() => res.status(200).json({ message: `No comment` }))
                                .catch((error) => res.status(400).json({ error }))
                        }
                        if (sauce.usersDisliked.includes(userId)) {
                            Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
                                .then(() => res.status(200).json({ message: `No comment` }))
                                .catch((error) => res.status(400).json({ error }))
                        }
                    })
                    .catch((error) => res.status(404).json({ error }))
            }
            break;
        case -1:
            if (like === -1) {
                Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } })
                    .then(() => { res.status(200).json({ message: `Dislike` }) })
                    .catch((error) => res.status(400).json({ error }))
            }
            break;

        default:
            console.log(error);
    }
};
*/
exports.like = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })        //on recupere la sauce avec son id present dans le parametre de la requete
        .then((sauce) => {                          //puis pour cette sauce
            //si le corps de la requete est like 1
            let isLiked = false;
            if (req.body.like === 1) {
                sauce.usersLiked.forEach(element => {   //boucle du tableau usersLiked
                    if (element == req.body.userId) {      //si le userId du corps de la requete est dans le tableau
                        isLiked = true;
                    }
                });
                if (isLiked == false) {//si le userId du corps de la requete n'est pas dans le tableau, ajout au tableau et au compteur des likes
                    Sauce.updateOne({ _id: sauce._id }, { likes: sauce.likes + 1, $addToSet: { usersLiked: req.body.userId } })
                        .then(res.status(200).json(console.log("C'est un likes !")))
                        .catch(error => res.status(400).json({ error }));
                }
            }

            //si le corps de la requete est like -1
            let isDisliked = false;
            if (req.body.like === -1) {
                sauce.usersDisliked.forEach(element => {
                    if (element == req.body.userId) {
                        isDisliked = true;
                    }
                    console.log(element)
                    console.log(req.body.userId)
                });
                if (isDisliked == false) {
                    Sauce.updateOne({ _id: sauce._id }, { dislikes: sauce.dislikes + 1, $addToSet: { usersDisliked: req.body.userId } })
                        .then(res.status(200).json(console.log("C'est un dislikes !")))
                        .catch(error => res.status(400).json({ error }));
                }
            }

            //si le corps de la requete est like 0
            if (req.body.like === 0) {
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: sauce._id }, { dislikes: sauce.dislikes - 1, $pull: { usersDisliked: req.body.userId } })
                        .then(res.status(200).json(console.log("Le dislikes est annulé !")))
                        .catch(error => res.status(400).json({ error }));
                }
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: sauce._id }, { likes: sauce.likes - 1, $pull: { usersLiked: req.body.userId } })
                        .then(res.status(200).json(console.log("Le likes est annulé !")))
                        .catch(error => res.status(400).json({ error }));
                }
            }
        })
        .catch(error => res.status(400).json({ error }));
};