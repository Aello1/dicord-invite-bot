const Mongo = require('mongoose');

let guild = new Mongo.Schema({
    guildId: String,
    ranks: Map
})

let model = Mongo.model('InviteGuildConfig', guild)

module.exports = model