const { MessageEmbed } = require('discord.js');
const LANG = require('../Configs/Language.json')
const BOT_CONFIG = require('../Configs/BotConfig.json')
module.exports = {
    name: 'example', // Komut adı
    aliases: ['örnek', 'ex', 'bkz'],
    description: LANG.HELP_COMMAND.EXAMPLE[BOT_CONFIG.LANGUAGE],
    example: LANG.COMMAND_EXAMPLE.EXAMPLE[BOT_CONFIG.LANGUAGE].replaceAll('{prefix}', BOT_CONFIG.PREFIX[0]),
    async run(message, args, client) {
        let command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));
        if (!command) message.reply(BOT_CONFIG.LANGUAGE === 'tr' ? 'Bu komut bulunamadı.' : 'This command not found.');
        message.channel.send({
            embeds: [
                new MessageEmbed().setColor('2f3136')
                    .setAuthor({ name: command.name + (BOT_CONFIG.LANGUAGE === 'tr' ? ' Komut Kullanımı' : ' Command Usage'), iconURL: message.guild.iconURL({ dynamic: true }) })
                    .setDescription(`${command.example}\n\n${BOT_CONFIG.LANGUAGE === 'tr' ? 'Tüm Prefixler' : 'ALL PREFIXES'}: \`${BOT_CONFIG.PREFIX.join('\` \`')}\``)
            ]
        })
    }
}