const {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
} = require("discord.js");
const { weeklyCoolDown } = require("../../models/Cooldowns");
const User = require("../../models/User");

module.exports = {
  weeklycooldown: 604800,
  data: new SlashCommandBuilder()
    .setName("weekly")
    .setDescription("Get your weekly income"),
  async execute(interaction) {
    const weeklyCoolDownExists = await weeklyCoolDown.findOne({
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

    if (weeklyCoolDownExists && weeklyCoolDownExists.expires > Date.now()) {
      const timeRemaining = Math.floor(
        weeklyCoolDownExists.expires.getTime() / 1000
      );
      return interaction.reply({
        content: `You are currently on a cooldown. Please wait <t:${timeRemaining}:R>`,
        flags: MessageFlags.Ephemeral,
      });
    }

    await User.updateOne(
      { userId: interaction.user.id },
      { $inc: { balance: 750 } }
    );
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
        url: `https://discord.com/users/${interaction.user.id}`,
      })
      .setTitle("Weekly Collect")
      .setDescription(
        "You have now collected your weekly allowance of <:points:1102646967659659294> 750."
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });

    // create new cooldown
    const createCooldown = new weeklyCoolDown({
      userId: interaction.user.id,
      expires: new Date(Date.now() + this.weeklycooldown * 1000),
    });

    const cooldownTime = this.weeklycooldown * 1000;
    const cooldownEnd = new Date(Date.now() + cooldownTime);

    if (weeklyCoolDownExists) {
      weeklyCoolDownExists.expires = cooldownEnd;
      await weeklyCoolDownExists.save();
    } else {
      await createCooldown.save();
    }
  },
};
