const {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Create a new account"),
  async execute(interaction) {
    // check for an existing user in the database
    const existingUser = await User.findOne({
      userId: interaction.user.id,
    });

    if (existingUser) {
      return interaction.reply({
        content: "You have already made an account",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      const user = new User({
        userId: interaction.user.id,
        serverId: interaction.guildId,
        joined: true,
      });
      await user.save();

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setAuthor({
          name: `${interaction.user.username}`,
          iconURL: `${interaction.user.displayAvatarURL()}`,
          url: `https://discord.com/users/${interaction.user.id}`,
        })
        .setTitle("Created Account")
        .setDescription(
          "You have successfully made an account and got <:points:1102646967659659294> 500 added to your cash account."
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }
  },
};
