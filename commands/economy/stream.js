const {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
} = require("discord.js");
const { streamCoolDown } = require("../../models/Cooldowns");
const User = require("../../models/User");
const { randomGen } = require("../../db/helper");

module.exports = {
  streamcooldown: 600,
  data: new SlashCommandBuilder()
    .setName("stream")
    .setDescription("Stream for some money"),
  async execute(interaction) {
    const streamCoolDownExists = await streamCoolDown.findOne({
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

    if (streamCoolDownExists && streamCoolDownExists.expires > Date.now()) {
      const timeRemaining = Math.floor(
        streamCoolDownExists.expires.getTime() / 1000
      );
      return interaction.reply({
        content: `You are currently on a cooldown. Please wait <t:${timeRemaining}:R>`,
        flags: MessageFlags.Ephemeral,
      });
    }

    const names = [
      "JoeIsPro",
      "Classic Noah",
      "Bob",
      "LunaStreams",
      "GamingWithGrace",
      "PixelPlaytime",
      "StreamQueen",
      "TheStreamMachine",
      "PlayfulPanda",
      "TechTonic",
      "StreamSiren",
      "GamerGoddess",
      "CyberSapien",
      "DigitalDreamer",
      "GameGeek",
      "PixelPirate",
      "TheGamingGuru",
      "PixelPal",
      "TheStreamingSorcerer",
      "DigitalDynamo",
      "Mrrrrrr BEEEEASSTT from Ohio",
    ];

    const randomName = randomGen(0, names.length - 1);
    const streamAmount = randomGen(50, 150);

    await User.updateOne(
      { userId: interaction.user.id },
      { $inc: { balance: streamAmount } }
    );

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Stream")
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
        url: `https://discord.com/users/${interaction.user.id}`,
      })
      .setDescription(
        `${names[randomName]} has donated <:points:1102646967659659294> ${streamAmount} for streaming an awesome game!`
      )
      .setTimestamp();

    interaction.reply({ embeds: [embed] });

    // create new cooldown
    const createCooldown = new streamCoolDown({
      userId: interaction.user.id,
      expires: new Date(Date.now() + this.streamcooldown * 1000),
    });

    const cooldownTime = this.streamcooldown * 1000;
    const cooldownEnd = new Date(Date.now() + cooldownTime);

    if (streamCoolDownExists) {
      streamCoolDownExists.expires = cooldownEnd;
      await streamCoolDownExists.save();
    } else {
      createCooldown.save();
    }
  },
};
