const Discord = require('discord.js');
const db = require('quick.db');
const { GiveawaysManager } = require('discord-giveaways'); // Ajoutez cette ligne

module.exports = {
    name: 'endgiveaway',
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
                return message.channel.send(`Utilisation: ${prefix}endgiveaway <ID du message ou prix du giveaway>`);
            }

            const giveaway = 
                client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === message.guild.id) ||
                client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === message.guild.id);

            if (!giveaway) {
                return message.channel.send('Impossible de trouver un giveaway pour `'+ query + '`.');
            }

            if (giveaway.ended) {
                return message.channel.send('Ce giveaway est déjà terminé.');
            }

            client.giveawaysManager.end(giveaway.messageId)
            .then(() => {
                // Le reste de votre code...
            })
            .catch((e) => {
                if(e.startsWith(`Giveaway with message ID ${giveaway.messageId} is already ended.`)){
                    message.channel.send('Ce giveaway est déjà terminé.');
                } else {
                    console.error(e);
                    message.channel.send('Une erreur s\'est produite...');
                }
            });
        }
    }
};