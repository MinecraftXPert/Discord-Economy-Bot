const {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");
const { crimeCoolDown } = require("../../models/Cooldowns");
const { randomGen } = require("../../db/helper");

module.exports = {
  crimeCooldown: 600,
  data: new SlashCommandBuilder()
    .setName("crime")
    .setDescription("Commit a crime"),
  async execute(interaction) {
    const crimeCoolDownExists = await crimeCoolDown.findOne({
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

    if (crimeCoolDownExists && crimeCoolDownExists.expires > Date.now()) {
      const timeRemaining = Math.floor(
        crimeCoolDownExists.expires.getTime() / 1000
      );
      return interaction.reply({
        content: `You are currently on a cooldown. Please wait <t:${timeRemaining}:R>`,
        flags: MessageFlags.Ephemeral,
      });
    }

    const crimeTotal = randomGen(-100, 100);

    const positiveMessages = [
      "You have successfully robbed a bank and gained",
      "You successfully assassinated the leader of a gang and won",
      "You became a crimelord and won",
      "You managed to pickpocket a random stranger and won",
      "You successfully committed tax evasion and for your hard work you got",
    ];

    const negativeMessages = [
      "You were caught robbing a bank and lost",
      "You were injured during a gang fight and lost",
      "You tried to steal from a gas station and lost",
      "You forgot to tie your shoes and you slipped and fell and lost",
      "You tried to pickpocket a bodybuilder and lost",
    ];

    await User.updateOne(
      { userId: interaction.user.id },
      { $inc: { balance: crimeTotal } }
    );

    if (crimeTotal < 0) {
      const negativeAnswer = randomGen(0, negativeMessages.length - 1);
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Crime")
        .setAuthor({
          name: `${interaction.user.username}`,
          iconURL: `${interaction.user.displayAvatarURL()}`,
          url: `https://discord.com/users/${interaction.user.id}`,
        })
        .setDescription(
          `${
            negativeMessages[negativeAnswer]
          } <:points:1102646967659659294> ${-crimeTotal}`
        )
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    } else {
      const positiveAnswer = randomGen(0, positiveMessages.length - 1);
      const embed2 = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Crime")
        .setAuthor({
          name: `${interaction.user.username}`,
          iconURL: `${interaction.user.displayAvatarURL()}`,
          url: `https://discord.com/users/${interaction.user.id}`,
        })
        .setDescription(
          `${positiveMessages[positiveAnswer]} <:points:1102646967659659294> ${crimeTotal}`
        );
      await interaction.reply({ embeds: [embed2] });
    }

    // create new cooldown
    const createCooldown = new crimeCoolDown({
      userId: interaction.user.id,
      expires: new Date(Date.now() + this.crimeCooldown * 1000),
    });

    const cooldownTime = this.crimeCooldown * 1000;
    const cooldownEnd = new Date(Date.now() + cooldownTime);

    if (crimeCoolDownExists) {
      crimeCoolDownExists.expires = cooldownEnd;
      await crimeCoolDownExists.save();
    } else {
      await createCooldown.save();
    }
  },
};
