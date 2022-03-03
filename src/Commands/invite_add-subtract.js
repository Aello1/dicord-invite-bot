const { MessageEmbed } = require('discord.js');
const $member = require('../Schemas/Models')
const LANG = require('../Configs/Language.json')
const BOT_CONFIG = require('../Configs/BotConfig.json')
module.exports = {
    name: 'bonus', // Komut adı
    aliases: [],
    description: LANG.HELP_COMMAND.BONUS[BOT_CONFIG.LANGUAGE],
    example: LANG.COMMAND_EXAMPLE.BONUS[BOT_CONFIG.LANGUAGE].replaceAll('{prefix}', BOT_CONFIG.PREFIX[0]),
    async run(message, args, client) {
        if (!message.member.permissions.has('ADMINISTRATOR') && !BOT_CONFIG.OWNERS.some(x => x === message.member.id)) return;
        let member = message.mentions.members.first() || await message.guild.members.cache.get(args[0])
        if (!member) return message.reply(BOT_CONFIG.LANGUAGE === 'tr' ? 'Bonus eklenecek kullanıcıyı belirtiniz.' : 'Please mention the user you want to give bonus.');
        let amount = args[1]
        if (!amount) return message.reply(BOT_CONFIG.LANGUAGE === 'tr' ? 'Bonus miktarını belirtiniz.' : 'Please specify the bonus amount.');
        if (isNaN(amount)) return message.reply(BOT_CONFIG.LANGUAGE === 'tr' ? 'Bonus bir sayı olmalıdır.' : 'Bonus amount must be a number.');
        await $member.findOneAndUpdate({ userId: member.id, guildId: member.guild.id }, { $inc: { 'Points.top': amount, 'Points.bonus': amount } }, { upsert: true }).exec();
        return message.channel.send(LANG.BONUS_COMMAND[BOT_CONFIG.LANGUAGE].replaceAll('{user}', member).replaceAll('{amount}', amount));
    }
}