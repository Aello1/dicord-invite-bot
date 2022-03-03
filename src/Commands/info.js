const { MessageEmbed } = require('discord.js');
const $member = require('../Schemas/Models')
const LANG = require('../Configs/Language.json')
const BOT_CONFIG = require('../Configs/BotConfig.json')
module.exports = {
    name: 'info', // Komut adı
    aliases: ['bilgi'],
    description: LANG.HELP_COMMAND.INFO[BOT_CONFIG.LANGUAGE],
    example: LANG.COMMAND_EXAMPLE.INFO[BOT_CONFIG.LANGUAGE].replaceAll('{prefix}', BOT_CONFIG.PREFIX[0]),
    async run(message, args, client) {
        let member = message.mentions.members.first() || await message.guild.members.cache.get(args[0]) || message.member;
        let $data = await $member.findOne({ userId: member.id, guildId: member.guild.id });
        let inviter = ($data && $data.Info.Inviter) ? client.users.cache.get($data.Info.Inviter).tag ?? 'Vanity-URL' : (BOT_CONFIG.LANGUAGE === 'tr' ? 'Bulunamadı.' : 'Not found.');
        let joinedAt = ($data && $data.Info.date) ? new Date(+$data.Info.date).toLocaleDateString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : (BOT_CONFIG.LANGUAGE === 'tr' ? 'Bulunamadı.' : 'Not found.');
        message.channel.send({
            embeds: [
                new MessageEmbed().setColor('2f3136').setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true }) })
                    .setDescription(LANG.INFO_COMMAND[BOT_CONFIG.LANGUAGE].replaceAll('{inviter}', inviter).replaceAll('{joinedAt}', joinedAt))
            ]
        });

    }
}