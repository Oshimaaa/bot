const Discord = require('discord.js');
const ms = require('ms');
const db = require('quick.db');
const messages = require("../utils/messages.js");

module.exports = {
    name: 'startgiveaway',
    aliases: [],
    run: async (client, message, args) => {
        let prefix = db.get(` ${process.env.owner}.prefix`);
        if(prefix === null) prefix = process.env.prefix;
        let color = db.get(`${process.env.owner}.color`);
        if(color === null) color = process.env.color;

        if(process.env.owner === message.author.id || db.get(`ownermd.${message.author.id}`) === true) {
            if(!message.guild) return;

            const giveawayChannel = message.mentions.channels.first();
            const giveawayDuration = args[0];
            const giveawayWinnerCount = parseInt(args[1]);
            const giveawayPrize = args.slice(2).join(' ');

            if(!giveawayChannel || !giveawayDuration || !giveawayWinnerCount || !giveawayPrize) {
                return message.channel.send(`Utilisation: ${prefix}startgiveaway <durée> <nombre de gagnants> <prix> <#channel>`);
            }

            client.giveawaysManager.start(giveawayChannel, {
                time: ms(giveawayDuration),
                prize: giveawayPrize,
                winnerCount: giveawayWinnerCount,
                hostedBy: process.env.HOSTED_BY ? message.author : null,
                messages: {
                    giveaway: (process.env.HOSTED_BY ? "@everyone\n\n" : "")+ "🎉🎉 **GIVEAWAY ** 🎉🎉",
                    giveawayEnded: (process.env.HOSTED_BY ? "@everyone\n\n" : "") + "🎉🎉 **GIVEAWAY TERMINÉ** 🎉🎉",
                    timeRemaining: "Temps restant: **{duration}**!",
                    inviteToParticipate: "Réagissez avec 🎉 pour participer!",
                    winMessage: "Félicitations, {winners}! Vous avez gagné **{prize}**!",
                    embedFooter: "Giveaway",
                    noWinner: "Giveaway annulé, aucune participation valide.",
                    hostedBy: "Hébergé par: {user}",
                    winners: "gagnant(s)",
                    endedAt: "Terminé à",
                    units: {
                        seconds: "secondes",
                        minutes: "minutes",
                        hours: "heures",
                        days: "jours",
                        pluralS: false 
                    }
                }
            });

            message.channel.send(`Giveaway démarré dans ${giveawayChannel} !`);
        }
    }
};