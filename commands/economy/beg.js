const {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");
const { randomGen } = require("../../db/helper");
const { begCoolDown } = require("../../models/Cooldowns");

module.exports = {
  begcooldown: 600,
  data: new SlashCommandBuilder()
    .setName("beg")
    .setDescription("Beg for money if you don't have a job"),
  async execute(interaction) {
    const user = await User.findOne({
      userId: interaction.user.id,
    });

    const begCoolDownExists = await begCoolDown.findOne({
      userId: interaction.user.id,
    });

    if (begCoolDownExists && begCoolDownExists.expires > Date.now()) {
      const timeRemaining = Math.floor(
        begCoolDownExists.expires.getTime() / 1000
      );
      return interaction.reply({
        content: `You are currently on a cooldown. Please wait <t:${timeRemaining}:R>`,
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

    if (user.hasJob) {
      return interaction.reply({
        content: "Looks like you already have a job so there's no need to beg",
        flags: MessageFlags.Ephemeral,
      });
    }

    const begMessages = [
      "Mr. Beast comes along and because you watched some of his videos, he gives you",
      "You are facing a financial situation and someone gives you",
      "You try to raise money for a soup charity and gain",
      "Someone sees you and feels bad for you. They offer you",
      "You ask for money to start up a small business and someone offers you",
      "You walk around and find",
      "You tell a sob story to your friend and they give you",
    ];
    const begMoney = randomGen(50, 150);
    const begMessage = randomGen(0, begMessages.length - 1);
    await User.updateOne(
      { userId: interaction.user.id },
      { $inc: { balance: begMoney } }
    );

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Beg")
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
        url: `https://discord.com/users/${interaction.user.id}`,
      })
      .setDescription(
        `${begMessages[begMessage]} <:points:1102646967659659294> ${begMoney}`
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    // create new cooldown
    const createCooldown = new begCoolDown({
      userId: interaction.user.id,
      expires: new Date(Date.now() + this.begcooldown * 1000),
    });

    const cooldownTime = this.begcooldown * 1000;
    const cooldownEnd = new Date(Date.now() + cooldownTime);

    if (begCoolDownExists) {
      begCoolDownExists.expires = cooldownEnd;
      await begCoolDownExists.save();
    } else {
      await createCooldown.save();
    }
  },
};
