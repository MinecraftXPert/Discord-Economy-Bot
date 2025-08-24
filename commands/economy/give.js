const {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("give")
    .setDescription("Give a certain amount of money to another user")
    .addUserOption((option) => {
      return option
        .setName("who")
        .setDescription("find a user to give money to")
        .setRequired(true);
    })
    .addIntegerOption((option) => {
      return option
        .setName("amount")
        .setDescription("how much money you want to give")
        .setRequired(true);
    }),
  async execute(interaction) {
    const targetMember = interaction.options.getUser("who");
    const amountToGive = interaction.options.getInteger("amount");
    const user = await User.findOne({
      userId: interaction.user.id,
    });
    const targetUser = await User.findOne({
      userId: targetMember.id,
    });
    if (!user) {
      return interaction.reply({
        content:
          "Whoops! You need to join first! Use the /join command to join in and get started!",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!targetUser) {
      return interaction.reply({
        content: "Sorry but it looks like they haven't joined yet",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (targetUser.userId === user.userId) {
      return interaction.reply({
        content: "You can't give money to yourself",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (amountToGive <= 0) {
      return interaction.reply({
        content: "You cannot give a user negative or zero amounts of money",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (amountToGive > user.balance) {
      return interaction.reply({
        content: "You don't have enough money to give this amount",
        flags: MessageFlags.Ephemeral,
      });
    }

    await User.updateOne(
      { userId: interaction.user.id },
      { $inc: { balance: -amountToGive } }
    );

    await User.updateOne(
      { userId: targetMember.id },
      { $inc: { balance: amountToGive } }
    );

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Give money")
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
        url: `https://discord.com/users/${interaction.user.id}`,
      })
      .setDescription(
        `You have successfully given ${targetMember.username} <:points:1102646967659659294> ${amountToGive}`
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
