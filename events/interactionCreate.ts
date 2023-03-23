import { EmbedBuilder, InteractionType, Interaction, DMChannel, Client, Colors, TextChannel, Events } from 'discord.js';
export const name = Events.InteractionCreate;
export const once = false;

export async function execute(interaction: Interaction) {
	if (!interaction.inCachedGuild()) return;
	switch (interaction.type) {
		case InteractionType.ApplicationCommand:
			const command = (interaction.client as Client<true>).commands.get(interaction.commandName);

			if (!command) return;

			if (interaction.channel instanceof DMChannel) {
				const embed = new EmbedBuilder();
				embed.setDescription('<:infosymbol:963414295641739324> You can\'t use commands in DMs!')
				.setColor(Colors.Red);
				await interaction.reply({ embeds: [embed] });
			} else {
				try {
					await command.execute(interaction);
				} catch (err) {
					if (err) console.error(err);
					await interaction.reply({
						content: "An error occured while executing that command. `" + err + "`.",
						ephemeral: true,
					});
				};
			}
			break;
		case InteractionType.ModalSubmit:
			if (!interaction.isFromMessage()) return;
			switch (interaction.customId) {
				case 'question-modal':
					const question = interaction.fields.getTextInputValue('question-input');

					// @ts-ignore
					const channel: TextChannel = interaction.client.channels.cache.get("971446883568472084")

					const questionEmbed = new EmbedBuilder();

					questionEmbed.author = { name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() };
					questionEmbed.title = '⭐ New Question ⭐';
					questionEmbed.color = Colors.Blurple;
					questionEmbed.fields = [
							{
								name: "Question",
								value: question
							}
						];
					questionEmbed.footer = { text: interaction.user.id };

					const message = await channel.send({ embeds: [questionEmbed] })
					await message.react("<:allow:984497626454061076>")
					await message.react("<:deny:984497629201334302>")
					await interaction.reply({ content: 'Question sent!', ephemeral: true });
					break;
			}
			break;
	}
}
