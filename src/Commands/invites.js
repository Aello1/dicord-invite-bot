const { MessageEmbed } = require('discord.js');
const $member = require('../Schemas/Models')
const LANG = require('../Configs/Language.json')
const BOT_CONFIG = require('../Configs/BotConfig.json')
module.exports = {
    name: 'invites', // Komut adı
    aliases: ['davetlerim', 'davetler'],
    description: LANG.HELP_COMMAND.INVITES[BOT_CONFIG.LANGUAGE],
    example: LANG.COMMAND_EXAMPLE.INVITES[BOT_CONFIG.LANGUAGE].replaceAll('{prefix}', BOT_CONFIG.PREFIX[0]),
    async run(message, args, client) {
        let member = message.mentions.members.first() || await message.guild.members.cache.get(args[0]) || message.member;
        let data = await $member.findOne({ userId: member.id });
        message.channel.send({
            embeds: [
                new MessageEmbed().setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true }) })
                    .setColor('2f3136')
                    .setDescription(LANG.INVITES_COMMAND[BOT_CONFIG.LANGUAGE].replaceAll('{top}', data?.Points.top ?? 0).replaceAll('{regular}', data?.Points.regular ?? 0).replaceAll('{fake}', data?.Points.fake ?? 0)
                        .replaceAll('{bonus}', data?.Points.bonus ?? 0).replaceAll('{leave}', data?.Points.leave ?? 0))
            ]
        }).catch(err => { });
    }
};