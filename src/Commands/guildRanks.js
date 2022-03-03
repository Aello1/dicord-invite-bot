const { MessageEmbed } = require('discord.js');
const LANG = require('../Configs/Language.json')
const BOT_CONFIG = require('../Configs/BotConfig.json')
const $guild = require('../Schemas/Guild')
const ascii = require('ascii-table')
module.exports = {
    name: 'rank', // Komut adı
    aliases: ['level', 'lvl', 'seviye'],
    description: LANG.HELP_COMMAND.RANK[BOT_CONFIG.LANGUAGE],
    example: LANG.COMMAND_EXAMPLE.RANK[BOT_CONFIG.LANGUAGE].replaceAll('{prefix}', BOT_CONFIG.PREFIX[0]),
    async run(message, args, client) {
        let rankTier = args[1];
        let rankRole = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
        let $data = await $guild.findOne({ guildId: message.guild.id })
        if (args[0] === 'add') {
            if (!rankTier || isNaN(rankTier)) return message.reply(LANG.RANK_NUM_ERROR[BOT_CONFIG.LANGUAGE]);
            if (!rankRole) return message.reply(LANG.RANK_ROLE_ERROR[BOT_CONFIG.LANGUAGE]);
            if (!$data) {
                let map = new Map()
                map.set(rankTier, rankRole.id)
                await $guild.create({ guildId: message.guild.id, ranks: map });
                message.reply(LANG.RANK_ADDED[BOT_CONFIG.LANGUAGE]);
            } else {
                $data.ranks.set(rankTier, rankRole.id)
                await $data.save()
                message.reply(LANG.RANK_ADDED[BOT_CONFIG.LANGUAGE]);
            }
        } else if (args[0] === 'remove') {
            if (!rankTier || isNaN(rankTier)) return message.reply(LANG.RANK_NUM_ERROR[BOT_CONFIG.LANGUAGE]);
            if (!$data) return message.reply(LANG.RANK_NOT_EXIST[BOT_CONFIG.LANGUAGE]);
            if (!$data.ranks.has(rankTier)) return message.reply(LANG.RANK_NOT_EXIST[BOT_CONFIG.LANGUAGE]);
            $data.ranks.delete(rankTier)
            await $data.save()
            message.reply(LANG.RANK_REMOVED[BOT_CONFIG.LANGUAGE]);
        } else {
            if (!$data) return message.reply(LANG.RANK_NOT_EXIST[BOT_CONFIG.LANGUAGE]);
            let ranks = Array.from($data.ranks.keys())
            ranks.sort((a, b) => a[0] - b[0])
            let table = new ascii()
                .setAlign(0, ascii.CENTER)
                .setAlign(1, ascii.CENTER)
                .setAlign(2, ascii.CENTER);
            table.setHeading('#', BOT_CONFIG.LANGUAGE === 'tr' ? 'Gerekli Davet' : 'Required Invites', BOT_CONFIG.LANGUAGE === 'tr' ? 'Rol Ödülü' : 'Role Reward');
            await ranks.forEach((rank, index) => {
                let rankRole = message.guild.roles.cache.get($data.ranks.get(rank))
                table.addRow(++index, rank, rankRole.name)
            })
            message.reply({
                embeds: [
                    new MessageEmbed().setColor('2f3136')
                        .setDescription(`\`\`\`\n${table.toString()}\`\`\``)
                ]
            });
        }
    }
}