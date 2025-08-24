const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");
const { getCostOfSolana } = require("../../solanacost");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sell")
    .setDescription("Sell your solana")
    .addStringOption((option) => {
      return option
        .setName("amount")
        .setDescription("How much solana you want to sell")
        .setRequired(true);
    }),
  async execute(interaction) {
    const amountInput = interaction.options.getString("amount");
    const cost = parseInt(getCostOfSolana());
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
      if (user.solana === 0) {
        return interaction.reply({
          content: "You do not have any solana to sell",
          flags: MessageFlags.Ephemeral,
        });
      }
      amount = user.solana;
      await User.updateOne(
        { userId: interaction.user.id },
        {
          $inc: {
            balance: cost * amount,
            solana: -amount,
          },
        }
      );
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Sell Solana")
        .setAuthor({
          name: `${interaction.user.username}`,
          iconURL: `${interaction.user.displayAvatarURL()}`,
          url: `https://discord.com/users/${interaction.user.id}`,
        })
        .setDescription(
          `You have successfully sold all your solana for <:points:1102646967659659294> ${cost} each.`
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } else {
      if (isNaN(amountInput) || amountInput <= 0) {
        return interaction.reply({
          content: "Please put in either all or a reasonable number",
          flags: MessageFlags.Ephemeral,
        });
      }
      if (user.solana === 0) {
        return interaction.reply({
          content: "You do not have any solana to sell",
          flags: MessageFlags.Ephemeral,
        });
      }
      if (amountInput > user.solana) {
        return interaction.reply({
          content: "You don't have that much solana to sell",
          flags: MessageFlags.Ephemeral,
        });
      }

      amount = parseInt(amountInput);
      await User.updateOne(
        { userId: interaction.user.id },
        {
          $inc: {
            balance: cost * amount,
            solana: -amount,
          },
        }
      );
      const embed2 = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Sell Solana")
        .setAuthor({
          name: `${interaction.user.username}`,
          iconURL: `${interaction.user.displayAvatarURL()}`,
          url: `https://discord.com/users/${interaction.user.id}`,
        })
        .setDescription(
          `You have successfully sold ${amount} solana for <:points:1102646967659659294> ${cost} each.`
        )
        .setTimestamp();
      await interaction.reply({ embeds: [embed2] });
    }
  },
};
