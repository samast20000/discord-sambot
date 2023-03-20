import { APIEmbedField, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName('magic8ball')
	.setDescription('Ask the magic eight-ball a question!')
	.addStringOption((option) => option
		.setName('question')
		.setDescription('Your question for the eight-ball to answer!')
		.setRequired(true)
	);

export async function execute(interaction: ChatInputCommandInteraction) {
	let answers = ["I certainly say yes.", "No.", "Sadly not.", "Yes.", "I say so.", "Hmm. No sorry!", "sorry I'm cleaning so I'm afraid not.", "you're hired"];
	let random = answers[Math.floor(Math.random() * answers.length)];

	const embed = new EmbedBuilder()
		.setTitle('Magic 8 Ball :8ball:')
		.setColor('Blurple')
		.addFields([
			{
				name: "Question",
				value: interaction.options.getString('question')
			},
			{
				name: "Answer",
				value: random
			}
		] as APIEmbedField[])
		.setFooter({ text: 'fortune telling', iconURL: 'https://media.discordapp.net/attachments/907587945198923806/938794904111423528/930422780124606474.gif' });
	await interaction.reply({ embeds: [embed] });
}