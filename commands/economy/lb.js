const {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Check the server leaderboard")
    .addBooleanOption((option) => {
      return option
        .setName("global")
        .setDescription("Get the global leaderboard");
    }),
  async execute(interaction) {
    const isGlobal = interaction.options.getBoolean("global");

    const user = await User.find({
      joined: true,
    })
      .sort({ balance: -1 }) // sorts out the array
      .limit(10); // limits it to top 10

    if (!interaction.guild && !isGlobal) {
      return interaction.reply({
        content:
          "Looks like I'm not in this server so I can't make a server leaderboard. Please invite me to your server in order for me to show a leaderboard.",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!user) {
      return interaction.reply({
        content:
          "Whoops! You need to join first! Use the /join command to join in and get started!",
        flags: MessageFlags.Ephemeral,
      });
    }

    // if global is true it'll show the global leaderboard, otherwise it'll show the server one
    if (isGlobal) {
      const globalNames = [];
      for (const members of user) {
        const users = await interaction.client.users.fetch(members.userId);
        globalNames.push(users.username);
      }

      // get all the balances
      const globalBalance = user.map((member) => {
        return member.balance;
      });

      // show the usernames and their balance
      const embed2 = new EmbedBuilder()
        .setColor("Green")
        .setAuthor({
          name: `${interaction.user.username}`,
          iconURL: `${interaction.user.displayAvatarURL()}`,
          url: `https://discord.com/users/${interaction.user.id}`,
        })
        .setTitle(`Global Leaderboard`)
        .setDescription(
          globalNames
            .map((member, index) => {
              return `${index + 1}. ${member} - <:points:1102646967659659294> ${
                globalBalance[index]
              }`;
            })
            .join("\n")
        )
        .setTimestamp();

      return interaction.reply({ embeds: [embed2] });
    } else {
      // filter all the members that have joined and get their usernames
      const names = [];
      const balances = [];
      for (const members of user) {
        // fetch all users in your server from discord's api and then only get the ones that have a userId from user
        const name = await interaction.guild.members
          .fetch(members.userId)
          .catch(() => null); // just ignores any members that have left or anything like that
        if (name) {
          names.push(name.user.username);
          balances.push(members.balance);
        } // gets the username and balance so the indexes aren't off
      }

      // show the usernames and their balance
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setAuthor({
          name: `${interaction.user.username}`,
          iconURL: `${interaction.user.displayAvatarURL()}`,
          url: `https://discord.com/users/${interaction.user.id}`,
        })
        .setTitle(`Leaderboard for ${interaction.guild.name}`)
        .setDescription(
          names
            .map((member, index) => {
              return `${index + 1}. ${member} - <:points:1102646967659659294> ${
                balances[index]
              }`;
            })
            .join("\n")
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }
  },
};
