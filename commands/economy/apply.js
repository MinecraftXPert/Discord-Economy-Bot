const {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
  Constants,
} = require("discord.js");
const User = require("../../models/User");
const { jobs } = require("../../jobs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("apply")
    .setDescription("Apply for a job")
    .addStringOption((option) => {
      return option
        .setName("job")
        .setDescription("choose the job you want to apply for")
        .setRequired(true)
        .setAutocomplete(true);
    }),

  // updates the string options based on your job level
  async autocomplete(interaction) {
    const user = await User.findOne({
      userId: interaction.user.id,
    });

    if (!user) {
      return interaction.respond([
        {
          name: "Looks like you haven't joined yet. Use /join to use this command.",
          value: "none",
        },
      ]);
    }

    // filters through the jobs
    let jobsList = jobs
      .filter((job) => job.level <= user.jobLevel)
      .map((job) => {
        return {
          name: job.title,
          value: job.title,
        };
      });

    await interaction.respond(jobsList);
  },
  async execute(interaction) {
    const job = interaction.options.getString("job");
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

    if (user.hasJob) {
      return interaction.reply({
        content: `Looks like you already work as a ${user.jobName} so you don't need to apply`,
        flags: MessageFlags.Ephemeral,
      });
    }

    const validJob = jobs.find((jobTitle) => job === jobTitle.title);

    if (!validJob) {
      return interaction.reply({
        content: "You must pick a valid job from the list",
        flags: MessageFlags.Ephemeral,
      });
    }

    // this saves your progress every time you use the /apply command
    const updateUser = {
      hasJob: true,
      jobName: job,
      income: validJob.income,
      jobCooldown: validJob.cooldown,
    };

    // if you just applied then you haven't worked yet but otherwise it will save your progress
    if (user.numTimesWorked == null) {
      updateUser.numTimesWorked = 0;
    }

    if (user) {
      await User.updateOne(
        { userId: interaction.user.id },
        { $set: updateUser }
      );
    }

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Apply")
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
        url: `https://discord.com/users/${interaction.user.id}`,
      })
      .setDescription(
        `You have successfully applied to your job as a ${job} and will now be making <:points:1102646967659659294> ${updateUser.income}`
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
