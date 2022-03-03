const { MessageEmbed } = require('discord.js');
const LANG = require('../Configs/Language.json')
const BOT_CONFIG = require('../Configs/BotConfig.json')
module.exports = {
    name: 'help', // Komut adı
    aliases: ['yardım'],
    description: LANG.HELP_COMMAND.HELP[BOT_CONFIG.LANGUAGE],
    example: LANG.COMMAND_EXAMPLE.HELP[BOT_CONFIG.LANGUAGE].replaceAll('{prefix}', BOT_CONFIG.PREFIX[0]),
    async run(message, args, client) {
        let commands = client.commands.map(command => `\`${BOT_CONFIG.PREFIX[0] + command.name}\`: ${command.description}`).join('\n');
        message.channel.send({
            embeds: [
                new MessageEmbed().setColor('2f3136')
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                    .setDescription(`${commands}\n\n${BOT_CONFIG.LANGUAGE === 'tr' ? 'Tüm Prefixler' : 'ALL PREFIXES'}: \`${BOT_CONFIG.PREFIX.join('\` \`')}\``)
            ]
        })
    }
}