const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: 'giveaway',
    aliases: [],
    run: async (client, message, args) => {
        let prefix = db.get(` ${process.env.owner}.prefix`);
        if(prefix === null) prefix = process.env.prefix;
        let color = db.get(`${process.env.owner}.color`);
        if(color === null) color = process.env.color;

        if(process.env.owner === message.author.id || db.get(`ownermd.${message.author.id}`) === true) {
            if(!message.guild) return;

            const giveawayChannel = message.mentions.channels.first();
            const giveawayWinnerCount = parseInt(args[0]);
            const giveawayPrize = args.slice(1).join(' ');

            if(!giveawayChannel || !giveawayWinnerCount || !giveawayPrize) {
                return message.channel.send(`Utilisation: ${prefix}giveaway <nombre de gagnants> <prix> <mention du canal>`);
            }

            if(!giveawayChannel.isText()) {
                return message.channel.send(':x: Le canal sélectionné n\'est pas basé sur du texte.');
            }

            client.giveawaysManager.start(giveawayChannel, {
                winnerCount: giveawayWinnerCount,
                prize: giveawayPrize,
                hostedBy: client.config.hostedBy ? message.author : null,
                isDrop: true,
                messages
            });

            message.channel.send(`Le giveaway a commencé dans ${giveawayChannel}!`);
        }
    }
};