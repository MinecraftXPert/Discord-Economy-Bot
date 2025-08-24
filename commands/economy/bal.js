const {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bal")
    .setDescription("see your balance")
    .addUserOption((option) => {
      return option.setName("who").setDescription("Get someone else's balance");
    }),
  async execute(interaction) {
    const targetMember = interaction.options.getUser("who");
    const user = await User.findOne({
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

    if (!targetMember) {
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Balance")
        .setDescription("Here is your current balance")
        .setAuthor({
          name: `${interaction.user.username}`,
          iconURL: `${interaction.user.displayAvatarURL()}`,
          url: `https://discord.com/users/${interaction.user.id}`,
        })
        .addFields(
          {
            name: "**Cash**",
            value: `**<:points:1102646967659659294> ${user.balance}**`,
          },
          {
            name: "**Solana**",
            value: `**<:points:1102646967659659294> ${user.solana}**`,
          }
        )
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    } else {
      const targetUser = await User.findOne({
        userId: targetMember.id,
      });
      if (!targetUser) {
        return interaction.reply({
          content:
            "Sorry but it looks like this user hasn't joined yet",
          flags: MessageFlags.Ephemeral,
        });
      }
      const embed2 = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Balance")
        .setDescription(`Here is ${targetMember.username}'s balance`)
        .setAuthor({
          name: `${targetMember.username}`,
          iconURL: `${targetMember.displayAvatarURL()}`,
          url: `https://discord.com/users/${targetMember.id}`,
        })
        .addFields(
          {
            name: "**Cash**",
            value: `**<:points:1102646967659659294> ${targetUser.balance}**`,
          },
          {
            name: "**Solana**",
            value: `**<:points:1102646967659659294> ${targetUser.solana}**`,
          }
        )
        .setTimestamp();
      await interaction.reply({ embeds: [embed2] });
    }
  },
};
