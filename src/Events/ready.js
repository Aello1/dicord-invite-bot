const client = global.client
const { log, clear } = require('console');
const CONFIG = require('../Configs/BotConfig.json')
const wait = require("util").promisify(setTimeout);
module.exports = async () => {
    clear()
    log(CONFIG.LANGUAGE === 'tr' ? `${client.user.tag} Başarıyla bağlandı!` : `${client.user.tag} Successfully connected!`);
    await wait(500)
    let guild = client.guilds.cache.get(CONFIG.GUILD_ID)
    if (guild) await guild.invites.fetch()
        .then(invites => {
            client.invites = invites[guild.id] = invites
        })
};

module.exports.conf = { name: 'ready' } 