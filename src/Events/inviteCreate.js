const client = global.client
const CONFIG = require('../Configs/BotConfig.json')
module.exports = async () => {
    let guild = client.guilds.cache.get(CONFIG.GUILD_ID)
    if (guild) await guild.invites.fetch()
        .then(invites => {
            client.invites = invites[guild.id] = invites
        })
};

module.exports.conf = { name: 'inviteCreate' } 