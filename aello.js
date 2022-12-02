const { Client, Intents, Collection } = require("discord.js");
const CONFIG = require("./src/Configs/BotConfig.json");
const fs = require("fs");
const Mongo = require("mongoose");
const chalk = require('chalk');
const client = global.client = new Client({ "intents": Object.keys(Intents.FLAGS) });
require("./src/Controller")

client.commands = new Collection();
client.aliases = new Collection();

Mongo.connect(CONFIG.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
Mongo.connection.on("open", async () => console.log('| VeriTabanı bağlantısı başarılı! |'));

fs.readdir("./src/Events", (err, files) => {
    files.forEach(async file => {
        if (!file.endsWith('.js')) return;
        const command = await require(`./src/Events/${file}`);
        command.conf ? client.on(command.conf.name, command) : null
    });
});

fs.readdirSync("./src/Commands").forEach(file => {
    const cmnds = require(`./src/Commands/${file}`)
    if (cmnds.name) {
        client.commands.set(cmnds.name, cmnds)
        console.log(`${chalk.red('Komut:')} ${cmnds.name} Yüklendi.`)
        cmnds.aliases.forEach(a => { client.aliases.set(a, cmnds.name) })
    }
})

client.on('messageCreate', message => {
    const PREFIX = CONFIG.PREFIX.find(char => message.content.toLowerCase().startsWith(char));
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;
    const args = message.content.slice(PREFIX.length).trim().split(' ');
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
    if (command) try { command.run(message, args, client) } catch (err) { console.error(err); message.channel.send('Bir Hata Oluştu!') };
});

client.login(CONFIG.TOKEN);
