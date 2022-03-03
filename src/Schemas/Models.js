const Mongo = require('mongoose');

let member = new Mongo.Schema({
    guildId: String,
    userId: String,
    Info: {
        Inviter: { type: String, default: "" },
        date: { type: String, default: "" }
    },
    Points: {
        top: { type: Number, default: 0 },
        regular: { type: Number, default: 0 },
        bonus: { type: Number, default: 0 },
        leave: { type: Number, default: 0 },
        fake: { type: Number, default: 0 },
    }
})

let model = Mongo.model('InviteManager', member)

module.exports = model