const {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");
const { getCostOfSolana } = require("../../solanacost");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Buy solana")
    .addStringOption((option) => {
      return option
        .setName("amount")
        .setDescription("How much solana do you want to buy")
        .setRequired(true);
    }),
  async execute(interaction) {
    let amountInput = interaction.options.getString("amount");
    let cost = parseInt(getCostOfSolana());
    let amount;

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

    if (amountInput.toLowerCase() === "all") {
      if (user.balance < cost) {
        return interaction.reply({
          content: "You do not have enough money to any more solana",
          flags: MessageFlags.Ephemeral,
        });
      }
      amount = Math.floor(user.balance / cost);
      await User.updateOne(
        { userId: interaction.user.id },
        {
          $inc: {
            balance: -(cost * amount),
            solana: amount,
          },
        }
      );
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Buy Solana")
        .setAuthor({
          name: `${interaction.user.username}`,
          iconURL: `${interaction.user.displayAvatarURL()}`,
          url: `https://discord.com/users/${interaction.user.id}`,
        })
        .setDescription(
          `You have bought all the solana you can afford for ${cost} each`
        )
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    } else {
      if (isNaN(amountInput) || amountInput < 1) {
        return interaction.reply({
          content: "Please put in either all or a reasonable number",
          flags: MessageFlags.Ephemeral,
        });
      }

      if (user.balance < cost * amountInput) {
        return interaction.reply({
          content: "You do not have enough money to buy this amount of solana",
          flags: MessageFlags.Ephemeral,
        });
      }

      amount = parseInt(amountInput);
      await User.updateOne(
        { userId: interaction.user.id },
        {
          $inc: {
            balance: -(cost * amount),
            solana: amount,
          },
        }
      );
      const embed2 = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Buy Solana")
        .setAuthor({
          name: `${interaction.user.username}`,
          iconURL: `${interaction.user.displayAvatarURL()}`,
          url: `https://discord.com/users/${interaction.user.id}`,
        })
        .setDescription(
          `You have successfully bought ${amount} solana for <:points:1102646967659659294> ${cost} each.`
        )
        .setTimestamp();
      await interaction.reply({ embeds: [embed2] });
    }
  },
};
