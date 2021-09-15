module.exports = {
    CheckPassword: function (input) {
        // Au moins 6 caractères, un nombre, une minuscule, une majuscule
        var regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        return regex.test(input);
    }
}