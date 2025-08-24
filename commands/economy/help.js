const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("See my list of commands"),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Help")
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
        url: `https://discord.com/users/${interaction.user.id}`,
      })
      .setDescription("These are all the list of commands I have")
      .addFields(
        {
          name: "**/ping**",
          value: "Checks to see if the bot is online",
          inline: true,
        },
        {
          name: "**/join**",
          value: "Create an account",
          inline: true,
        },
        {
          name: "**/daily**",
          value: "Allows you to collect your daily income",
          inline: true,
        },
        {
          name: "**/crime**",
          value: "Allows you to commit a crime",
          inline: true,
        },
        {
          name: "**/weekly**",
          value: "Allows you to collect your weekly allowance",
          inline: true,
        },
        {
          name: "**/bal**",
          value: "Checks your current balance",
          inline: true,
        },
        {
          name: "**/beg**",
          value: "Beg for money if you don't have a job",
          inline: true,
        },
        {
          name: "**/stream**",
          value: "Stream for some money",
          inline: true,
        },
        {
          name: "**/leaderboard**",
          value:
            "Checks the top 10 leaderboard either global or in your server",
          inline: true,
        },
        {
          name: "**/buy**",
          value: "Will allow you to buy solana",
          inline: true,
        },
        {
          name: "**/sell**",
          value: "Will allow you to sell solana",
          inline: true,
        },
        {
          name: "**/cost**",
          value:
            "Will show the current cost of solana (updates every 5 mintues)",
          inline: true,
        },
        {
          name: "**/give**",
          value: "Will allow you to give a certain amount of money to someone",
          inline: true,
        },
        {
          name: "**/apply**",
          value: "Apply for a job",
          inline: true,
        },
        {
          name: "**/work**",
          value: "Work at your current job",
          inline: true,
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
