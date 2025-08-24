const {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
} = require("discord.js");
const { monthlyCoolDown } = require("../../models/Cooldowns");
const User = require("../../models/User");

module.exports = {
  monthlycooldown: 2592000,
  data: new SlashCommandBuilder()
    .setName("monthly")
    .setDescription("Get your monthly income"),
  async execute(interaction) {
    const monthlyCoolDownExists = await monthlyCoolDown.findOne({
      userId: interaction.user.id,
    });

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

    if (monthlyCoolDownExists && monthlyCoolDownExists.expires > Date.now()) {
      const timeRemaining = Math.floor(
        monthlyCoolDownExists.expires.getTime() / 1000
      );
      return interaction.reply({
        content: `You are currently on a cooldown. Please wait <t:${timeRemaining}:R>`,
        flags: MessageFlags.Ephemeral,
      });
    }

    await User.updateOne(
      { userId: interaction.user.id },
      { $inc: { balance: 10000 } }
    );
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
        url: `https://discord.com/users/${interaction.user.id}`,
      })
      .setTitle("Monthly Collect")
      .setDescription(
        "You have now collected your monthly allowance of <:points:1102646967659659294> 10000."
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });

    // create new cooldown
    const createCooldown = new monthlyCoolDown({
      userId: interaction.user.id,
      expires: new Date(Date.now() + this.monthlycooldown * 1000),
    });

    const cooldownTime = this.monthlycooldown * 1000;
    const cooldownEnd = new Date(Date.now() + cooldownTime);

    if (monthlyCoolDownExists) {
      monthlyCoolDownExists.expires = cooldownEnd;
      await monthlyCoolDownExists.save();
    } else {
      await createCooldown.save();
    }
  },
};
