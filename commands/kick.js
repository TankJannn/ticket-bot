const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick een persoon.')
    .addUserOption(option =>
      option.setName('target')
      .setDescription('Kick lid')
      .setRequired(true))
    .addStringOption(option =>
        option.setName('reden')
        .setDescription('Reden voor kick')
        .setRequired(false)),
  async execute(interaction, client) {
    const user = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.options.getUser('target').id);
    const executer = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id);

    if (!executer.permissions.has(client.discord.Permissions.FLAGS.KICK_MEMBERS)) return interaction.reply({
      content: 'U hebt niet de vereiste toestemming om deze command uit te voeren! (`KICK_MEMBERS`)',
      ephemeral: true
    });

    if (user.roles.highest.rawPosition > executer.roles.highest.rawPosition) return interaction.reply({
      content: 'De persoon die je wilt kicken staat boven je!',
      ephemeral: true
    });

    if (!user.kickable) return interaction.reply({
      content: 'De persoon die je wilt kicken staat boven mij! Dus ik kan er niet tegenaan schoppen.',
      ephemeral: true
    });

    if (interaction.options.getString('reden')) {
      user.kick(interaction.options.getString('reden'))
      interaction.reply({
        content: `**${user.user.tag}** Werd met succes gekickt!`
      });
    } else {
      user.kick()
      interaction.reply({
        content: `**${user.user.tag}** Werd met succes gekickt!`
      });
    };
  },
};