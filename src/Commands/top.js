const { MessageEmbed } = require('discord.js');
const $member = require('../Schemas/Models')
const LANG = require('../Configs/Language.json')
const BOT_CONFIG = require('../Configs/BotConfig.json')
module.exports = {
    name: 'top', // Komut adı
    aliases: ['topdavet'],
    description: LANG.HELP_COMMAND.TOP[BOT_CONFIG.LANGUAGE],
    example: LANG.COMMAND_EXAMPLE.TOP[BOT_CONFIG.LANGUAGE].replaceAll('{prefix}', BOT_CONFIG.PREFIX[0]),
    async run(message, args, client) {
        let $data = await $member.find({ guildId: message.guild.id }).sort({ "Points.top": -1 }).limit(10).exec();
        let $author = await $member.findOne({ userId: message.author.id })
        let inviters = $data.map(x => `<@${x.userId}> (${LANG.INVITES_COMMAND[BOT_CONFIG.LANGUAGE].replaceAll('{top}', x?.Points.top ?? 0).replaceAll('{regular}', x?.Points.regular ?? 0).replaceAll('{fake}', x?.Points.fake ?? 0)
            .replaceAll('{bonus}', x?.Points.bonus ?? 0).replaceAll('{leave}', x?.Points.leave ?? 0)}`)
        $data.forEach((data, index) => { if (data.userId === message.author.id) $index = ++index })
        message.channel.send({
            embeds: [
                new MessageEmbed().setColor('2f3136')
                    .setDescription(`**•** ${LANG.FIND_AUTHOR_ON_TOP_COMMAND[BOT_CONFIG.LANGUAGE].replaceAll('{top}', $author?.Points?.top ?? 0).replaceAll('{rank}', $index)}\n\n${inviters.join('\n')}`)
            ]
        }).catch((err) => { })
    }
}