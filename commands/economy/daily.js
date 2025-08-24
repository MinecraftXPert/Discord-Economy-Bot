const {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
} = require("discord.js");
const { dailyCooldown } = require("../../models/Cooldowns");
const User = require("../../models/User");

module.exports = {
  dailyCooldown: 86400,
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Get your daily income"),
  async execute(interaction) {
    // checks to see if there is a daily cooldown already in the database
    const dailyCooldownExists = await dailyCooldown.findOne({
      userId: interaction.user.id,
    });

    // gets our user info
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

    // tell the user that there is a cooldown
    if (dailyCooldownExists && dailyCooldownExists.expires > Date.now()) {
      const timeRemaining = Math.floor(
        dailyCooldownExists.expires.getTime() / 1000
      );
      return interaction.reply({
        content: `You are currently on a cooldown. Please wait <t:${timeRemaining}:R>`,
        flags: MessageFlags.Ephemeral,
      });
    }

    // the command logic
    await User.updateOne(
      { userId: interaction.user.id },
      { $inc: { balance: 500 } }
    );
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
        url: `https://discord.com/users/${interaction.user.id}`,
      })
      .setTitle("Daily Collect")
      .setDescription(
        "You have now collected your daily allowance of <:points:1102646967659659294> 500."
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });

    // create new cooldown
    const createCooldown = new dailyCooldown({
      userId: interaction.user.id,
      expires: new Date(Date.now() + this.dailyCooldown * 1000),
    });

    const cooldownTime = this.dailyCooldown * 1000;
    const cooldownEnd = new Date(Date.now() + cooldownTime);

    if (dailyCooldownExists) {
      dailyCooldownExists.expires = cooldownEnd;
      await dailyCooldownExists.save();
    } else {
      await createCooldown.save();
    }
  },
};
