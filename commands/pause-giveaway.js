const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: 'pausegiveaway',
    aliases: [],
    run: async (client, message, args) => {
        let prefix = db.get(` ${process.env.owner}.prefix`);
        if(prefix === null) prefix = process.env.prefix;
        let color = db.get(`${process.env.owner}.color`);
        if(color === null) color = process.env.color;

        if(process.env.owner === message.author.id || db.get(`ownermd.${message.author.id}`) === true) {
            if(!message.guild) return;

            const query = args.join(' ');

            if(!query) {
                return message.channel.send(`Utilisation: ${prefix}pausegiveaway <ID du message ou prix du giveaway>`);
            }

            const giveaway = 
                client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === message.guild.id) ||
                client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === message.guild.id);

            if (!giveaway) {
                return message.channel.send('Impossible de trouver un giveaway pour `'+ query + '`.');
            }

            if (giveaway.pauseOptions.isPaused) {
                return message.channel.send('Ce giveaway est déjà en pause.');
            }

            client.giveawaysManager.pause(giveaway.messageId)
            .then(() => {
                message.channel.send('Giveaway mis en pause !');
            })
            .catch((e) => {
                message.channel.send(e);
            });
        }
    }
};