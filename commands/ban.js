const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban een persoon.')
    .addUserOption(option =>
      option.setName('target')
      .setDescription('Ban lid')
      .setRequired(true))
    .addStringOption(option =>
      option.setName('reden')
      .setDescription('Reden voor verbod')
      .setRequired(false)),
  async execute(interaction, client) {
    const user = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.options.getUser('target').id);
    const executer = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id);

    if (!executer.permissions.has(client.discord.Permissions.FLAGS.BAN_MEMBERS)) return interaction.reply({
      content: 'U hebt niet de vereiste toestemming om deze command uit te voeren! (`BAN_MEMBERS`)',
      ephemeral: true
    });

    if (user.roles.highest.rawPosition > executer.roles.highest.rawPosition) return interaction.reply({
      content: 'De persoon die je wilt verbannen staat boven je!',
      ephemeral: true
    });

    if (!user.bannable) return interaction.reply({
      content: 'De persoon die je wilt verbieden staat boven mij! Ik kan het dus niet verbieden.',
      ephemeral: true
    });

    if (interaction.options.getString('reden')) {
      user.ban({
        reason: interaction.options.getString('reden'),
        days: 1
      });
      interaction.reply({
        content: `**${user.user.tag}** Werd met succes verbannen!`
      });
    } else {
      user.ban({
        days: 1
      });
      interaction.reply({
        content: `**${user.user.tag}** Werd met succes verbannen!`
      });
    };
  },
};