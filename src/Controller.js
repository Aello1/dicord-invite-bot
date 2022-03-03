const BOT_CONFIG = require('./Configs/BotConfig.json');
if (BOT_CONFIG.LANGUAGE.length === 0) throw new Error('TR: Bot dili belirtilmeli. EN: The language of the bot must be specified.');
if (BOT_CONFIG.LANGUAGE !== 'tr' && BOT_CONFIG.LANGUAGE !== 'en') throw new Error('TR: Bot dili tr ya da en olmalı. EN: The language of the bot must be tr or en.');
if (BOT_CONFIG.PREFIX.length === 0) throw new Error('TR: Bot prefixi belirtilmeli. EN: The prefix of the bot must be specified.');
if (BOT_CONFIG.OWNERS.length === 0) throw new Error('TR: Bot sahibi belirtilmeli. EN: The owner of the bot must be specified.');
