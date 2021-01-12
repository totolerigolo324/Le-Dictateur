const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args, data) => {
  let user = await client.users.fetch(args[0]);
  if (!user) return message.reply("l'utilisateur n'existe pas.");
  message.guild.members.unban(user);

  const embed = new MessageEmbed()
    .setAuthor(`${user.username} (${user.id})`, user.displayAvatarURL())
    .setColor("#35f092")
    .setDescription(`**Action**: unban`)
    .setTimestamp()
    .setFooter(message.author.username, message.author.avatarURL());

  client.channels.cache.get(data.logchannel).send(embed);
  message.delete();
};

module.exports.help = {
  name: "unban",
  aliases: ['unban'],
  category: 'moderation',
  displayName: '🛠️ Moderation',
  description: "Unban un utilisateur",
  cooldown: 3,
  usage: '<user_id>',
  isUserAdmin: false,
  permissions: true,
  args: true,
  logchannel: true,
  exp: false,
  rpg: false
};