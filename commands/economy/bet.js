const {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bet")
    .setDescription("Bet a certain amount of money on a coin flip")
    .addIntegerOption((option) => {
      return option
        .setName("amount")
        .setDescription("how much you want to bet")
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName("coin")
        .setDescription("choose either heads or tails")
        .setRequired(true)
        .setChoices(
          { name: "Heads", value: "heads" },
          { name: "Tails", value: "tails" }
        );
    }),

  async execute(interaction) {
    const betAmount = interaction.options.getInteger("amount");
    const choice = interaction.options.getString("coin");
    const winOrLose = Math.random() > 0.5 ? "heads" : "tails";

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

    if (betAmount > 10000 || betAmount <= 0) {
      return interaction.reply({
        content: `Please bet something less than 10000 or a reasonable number`,
        flags: MessageFlags.Ephemeral,
      });
    }

    if (betAmount > user.balance) {
      return interaction.reply({
        content: `You do not have enough money to bet that much`,
        flags: MessageFlags.Ephemeral,
      });
    }

    await User.updateOne(
      { userId: interaction.user.id },
      { $inc: { balance: -betAmount } }
    );

    if (choice === winOrLose) {
      await User.updateOne(
        { userId: interaction.user.id },
        { $inc: { balance: betAmount * 2 } }
      );
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Bet")
        .setAuthor({
          name: `${interaction.user.username}`,
          iconURL: `${interaction.user.displayAvatarURL()}`,
          url: `https://discord.com/users/${interaction.user.id}`,
        })
        .setDescription(
          `You bet ${choice} and the coin landed on ${winOrLose} so you won!`
        )
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    } else {
      const embed2 = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Bet")
        .setAuthor({
          name: `${interaction.user.username}`,
          iconURL: `${interaction.user.displayAvatarURL()}`,
          url: `https://discord.com/users/${interaction.user.id}`,
        })
        .setDescription(
          `Oof, you bet ${choice} and the coin landed on ${winOrLose} so you lost.`
        )
        .setTimestamp();
      await interaction.reply({ embeds: [embed2] });
    }
  },
};
