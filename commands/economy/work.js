const {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");
const { workCoolDown } = require("../../models/Cooldowns");
const { jobs } = require("../../jobs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Work at your job"),
  async execute(interaction) {
    const user = await User.findOne({
      userId: interaction.user.id,
    });

    const workCoolDownExists = await workCoolDown.findOne({
      userId: interaction.user.id,
    });

    // gets the first object where your jobName is the same as the title in the jobs array
    const jobWorkCoolDown = jobs.find((job) => job.title === user.jobName);

    // this is still the same as before just checks if the expiration date isn't over yet
    if (workCoolDownExists && workCoolDownExists.expires > Date.now()) {
      const timeRemaining = Math.floor(
        workCoolDownExists.expires.getTime() / 1000
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

    if (!user.hasJob) {
      return interaction.reply({
        content:
          "Looks like you don't have a job yet so you can't work yet. Use /apply to get a job",
        flags: MessageFlags.Ephemeral,
      });
    }

    await User.updateOne(
      { userId: interaction.user.id },
      { $inc: { numTimesWorked: 1, balance: user.income } }
    );

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Work")
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
        url: `https://discord.com/users/${interaction.user.id}`,
      })
      .setDescription(
        `You worked as a ${user.jobName} and made <:points:1102646967659659294> ${user.income}`
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    const embed2 = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Promotion")
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
        url: `https://discord.com/users/${interaction.user.id}`,
      })
      .setDescription(
        `Your boss was impressed and gave you a promotion! You can now apply for better jobs.`
      )
      .setTimestamp();

    switch (user.numTimesWorked) {
      case 20:
        await User.updateOne(
          { userId: interaction.user.id },
          { $inc: { jobLevel: 1 } }
        );
        await interaction.followUp({ embeds: [embed2] });
        break;
      case 50:
        await User.updateOne(
          { userId: interaction.user.id },
          { $inc: { jobLevel: 1 } }
        );
        await interaction.followUp({ embeds: [embed2] });
        break;
      case 80:
        await User.updateOne(
          { userId: interaction.user.id },
          { $inc: { jobLevel: 1 } }
        );
        await interaction.followUp({ embeds: [embed2] });
        break;
      case 140:
        await User.updateOne(
          { userId: interaction.user.id },
          { $inc: { jobLevel: 1 } }
        );
        await interaction.followUp({ embeds: [embed2] });
        break;
      case 200:
        await User.updateOne(
          { userId: interaction.user.id },
          { $inc: { jobLevel: 1 } }
        );
        await interaction.followUp({ embeds: [embed2] });
        break;
      case 300:
        await User.updateOne(
          { userId: interaction.user.id },
          { $inc: { jobLevel: 1 } }
        );
        await interaction.followUp({ embeds: [embed2] });
        break;
    }

    // create new cooldown but this time based off the cooldown you're given
    const createCooldown = new workCoolDown({
      userId: interaction.user.id,
      expires: new Date(Date.now() + jobWorkCoolDown.cooldown * 1000),
    });

    const cooldownTime = jobWorkCoolDown.cooldown * 1000;
    const cooldownEnd = new Date(Date.now() + cooldownTime);

    if (workCoolDownExists) {
      workCoolDownExists.expires = cooldownEnd;
      await workCoolDownExists.save();
    } else {
      createCooldown.save();
    }
  },
};
