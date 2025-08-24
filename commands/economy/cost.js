const {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");
const { getCostOfSolana } = require("../../solanacost");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cost")
    .setDescription("See the cost of Solana"),
  async execute(interaction) {
    const user = await User.find({
      userId: interaction.user.id,
    });

    // check if a user doesn't exist yet
    if (!user) {
      return interaction.reply({
        content:
          "Whoops! You need to join first! Use the /join command to join in and get started!",
        flags: MessageFlags.Ephemeral,
      });
    }

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Cost of Solana")
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
        url: `https://discord.com/users/${interaction.user.id}`,
      })
      .setDescription(
        `The cost of solana right now is <:points:1102646967659659294> ${getCostOfSolana()}`
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
