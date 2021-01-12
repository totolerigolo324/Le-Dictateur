const { MessageEmbed } = require("discord.js");
const moment = require("moment");

module.exports.run = (client, message) => {
  const guild = message.guild;

  const embed = new MessageEmbed()
    .setColor("#C016FF")
    .setThumbnail(guild.iconURL())
    .setDescription(`Votre serveur possède ${guild.channels.cache.filter(ch => ch.type === "text").size} salons textuels et ${guild.channels.cache.filter(ch => ch.type === "voice").size} salons vocaux avec ${guild.memberCount -1 } membres.`)
    .addField(`Plus d'informations à propos de: **${guild.name}**`,
      `• ID: ${guild.id}
      • Owner: ${guild.owner.user.tag} (${guild.ownerID})
      • Roles: ${guild.roles.cache.size}
      • Créé le: ${moment(guild.createdAt).format('DD/MM/YYYY')}
      `  
    )
    .setFooter(`${client.user.username} - Serverinfo`);

  message.channel.send(embed);
  message.delete();
};

module.exports.help = {
  name: "serverinfo",
  aliases: ['serverinfo'],
  category: 'utile',
  displayName: '📁 Utile',
  description: "Renvoie des informations concernant le serveur!",
  cooldown: 3,
  usage: '',
  isUserAdmin: false,
  permissions: false,
  args: false,
  logchannel: false,
  exp: false,
  rpg: false
};