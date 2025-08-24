const {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");
const { jobs } = require("../../jobs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resign")
    .setDescription("Resign from your job"),
  async execute(interaction) {
    const user = await User.findOne({
      userId: interaction.user.id,
    });

    if (!user) {
      return interaction.reply({
        content:
          "Whoops! You need to join first! Use the /join command to join in and get started!",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!user.hasJob) {
      return interaction.reply({
        content: "You can't resign from a job if you don't have one yet",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (user) {
      await User.updateOne(
        { userId: interaction.user.id },
        {
          $set: { hasJob: false },
          $unset: { jobName: "", income: 0 },
        }
      );
    }

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("Resign")
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
        url: `https://discord.com/users/${interaction.user.id}`,
      })
      .setDescription("You have successfully resigned from your job")
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
