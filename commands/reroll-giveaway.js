const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: 'rerollgiveaway',
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
                return message.channel.send(`Utilisation: ${prefix}rerollgiveaway <ID du message ou prix du giveaway>`);
            }

            const giveaway = 
                client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === message.guild.id) ||
                client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === message.guild.id);

            if (!giveaway) {
                return message.channel.send('Impossible de trouver un giveaway pour `'+ query + '`.');
            }

            if (!giveaway.ended) {
                return message.channel.send('Le giveaway n\'est pas encore terminé.');
            }

            client.giveawaysManager.reroll(giveaway.messageId)
            .then(() => {
                message.channel.send('Giveaway relancé !');
            })
            .catch((e) => {
                message.channel.send(e);
            });
        }
    }
};