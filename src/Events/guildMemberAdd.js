const client = global.client
const BOTCONFIG = require('../Configs/BotConfig.json')
const CONFIG = require('../Configs/Config.json')
const $member = require('../Schemas/Models')
const LANG = require('../Configs/Language.json')
let $ranks = require('../Schemas/Guild')
let invite;
let type = false
let $inviter;
let rankMessage = '';
module.exports = async member => { // Başına $ eklenenler veritabanı ile alakalı tanımlardır. / $ prepended are database-related definitions.
    if (member.user.bot || member.guild.id !== BOTCONFIG.GUILD_ID) return;
    const ei = Object.fromEntries(client.invites.map(i => [i.code, i.uses]));
    await member.guild.invites.fetch().then(invites => {
        invite = invites.find(i => {
            return i.uses > ei[i.code]
        });
    });

    let $rank = await $ranks.findOne({ guildId: BOTCONFIG.GUILD_ID })
    let inviter = invite.inviter ? member.guild.members.cache.get(invite.inviter.id) : null;
    let log = client.channels.cache.get(CONFIG.LOG_CHANNEL);

    if ((Date.now() - member.user.createdTimestamp) < 1000 * 60 * 60 * 24 * CONFIG.FAKE_DAY) {
        $inviter = await $member.findOneAndUpdate({ userId: inviter.id, guildId: member.guild.id }, { $inc: { "Points.top": 1, "Points.fake": 1 } }, { new: true, upsert: true }).exec();
        type = true;
    }
    else $inviter = await $member.findOneAndUpdate({ userId: inviter.id, guildId: member.guild.id }, { $inc: { "Points.top": 1, "Points.regular": 1 } }, { new: true, upsert: true }).exec();
    await $member.findOneAndUpdate({ userId: member.id, guildId: member.guild.id }, { $set: { "Info.Inviter": inviter?.id ?? 'Vanity-URL', "Info.date": Date.now() } }, { upsert: true }).exec();
    let onRank = await $rank?.ranks?.has(String($inviter.Points.top)) ?? false
    onRank ? (() => {
        let rankRole = member.guild.roles.cache.get($rank.ranks.get(String($inviter.Points.top)));
        rankRole ? (BOTCONFIG.LANGUAGE === 'tr' ? rankMessage = `\`${rankRole.name}\` Rolü verildi.` : rankMessage = `\`${rankRole.name}\` role was given.`) : null
        inviter.roles.add(String(rankRole.id)).catch(err => { });
    })() : null

    if (log) log.send(LANG.ADD_MESSAGE[BOTCONFIG.LANGUAGE].replaceAll('{user}', member).replaceAll('{inviter}', inviter ? inviter.user.tag : 'Vanity-URL')
        .replaceAll('{rank}', rankMessage).replaceAll('{regular}', $inviter.Points.regular)
        .replaceAll('{top}', $inviter.Points.top ?? 1)).catch(err => { });

}

module.exports.conf = { name: 'guildMemberAdd' };