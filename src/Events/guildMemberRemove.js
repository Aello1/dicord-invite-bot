const client = global.client;
const BOTCONFIG = require('../Configs/BotConfig.json');
const CONFIG = require('../Configs/Config.json');
const $member = require('../Schemas/Models');
let $ranks = require('../Schemas/Guild');
const LANG = require('../Configs/Language.json');
let rankMessage = ''
module.exports = async member => { // Başına $ eklenenler veritabanı ile alakalı tanımlardır. / $ prepended are database-related definitions.
    if (member.user.bot || member.guild.id !== BOTCONFIG.GUILD_ID) return;

    let $left = await $member.findOne({ userId: member.id, guildId: member.guild.id });
    let inviter = $left ? await member.guild.members.cache.get($left.Info.Inviter) : null;
    if (inviter) $inviter = await $member.findOneAndUpdate({ userId: inviter.id, guildId: member.guild.id }, { $inc: { "Points.leave": 1, "Points.top": -1 } }, { new: true, upsert: true }).exec();
    let log = client.channels.cache.get(CONFIG.LOG_CHANNEL);
    let $rank = await $ranks.findOne({ guildId: BOTCONFIG.GUILD_ID });
    let onRank = await $rank?.ranks?.has(String($inviter.Points.top + 1)) ?? false;

    if (onRank) {
        let rankRole = await member.guild.roles.cache.get($rank.ranks.get(String($inviter.Points.top + 1)));
        if (rankRole) {
            BOTCONFIG.LANGUAGE === 'tr' ? rankMessage = `\`${rankRole.name}\` Rolü kaldırıldı.` : rankMessage = `\`${rankRole.name}\` role was removed.`
            inviter.roles.remove(String(rankRole.id))
        }
    }
    if (log && inviter) log.send(LANG.LEAVE_MESSAGE[BOTCONFIG.LANGUAGE].replaceAll('{user}', member.user.tag).replaceAll('{rank}', rankMessage).replaceAll('{inviter}', inviter?.user.tag ?? (BOTCONFIG.LANGUAGE === 'tr' ? 'Bulunamadı/Vanity-URL' : 'Not Found/Vanity-URL')).replaceAll('{top}', $inviter?.Points.top ?? null)).catch(err => { });
    else if (log) log.send(LANG.INVITER_NOT_FOUND[BOTCONFIG.LANGUAGE].replaceAll('{user}', member.user.tag).replaceAll('{rank}', rankMessage)).catch(err => { });
};

module.exports.conf = { name: 'guildMemberRemove' };