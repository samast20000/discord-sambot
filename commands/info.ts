import {
	EmbedBuilder,
	ActionRowBuilder,
	SelectMenuBuilder,
	ComponentType,
	ButtonBuilder,
	ButtonStyle,
	SlashCommandBuilder,
	SelectMenuInteraction,
	ChatInputCommandInteraction,
	Guild
} from "discord.js";
import { readdirSync } from 'fs';

export const data = new SlashCommandBuilder()
	.setName('info')
	.setDescription('Gives you info about this bot.')
	.addSubcommand((subcommand) => subcommand
		.setName('general')
		.setDescription('Info about this bot.')
	)
	.addSubcommand((subcommand) => subcommand
		.setName('links')
		.setDescription('Special links!')
	);
	
export async function execute(interaction: ChatInputCommandInteraction) {
	await interaction.deferReply({ ephemeral: true });
	if (interaction.options.getSubcommand() === 'general') {
		const commands: any = readdirSync('./commands').filter(file => file.endsWith('.js'));
		let a: number = 0;	
		for (let file of commands) {
			if (file) {
				a++;
			}
		};

		const memberCount = interaction.client.guilds.cache.reduce((acc: any, guild: Guild) => acc + guild.memberCount, 0)

		const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents([
			new SelectMenuBuilder()
				.setCustomId('info-menu')
				.setPlaceholder('Select a category!')
				.setDisabled(false)
				.addOptions([
					{
						label: 'Bot Info',
						value: 'bot info',
						description: 'Info about the bot.',
						emoji: '🤖'
					},
					{
						label: 'Credits',
						value: 'credits',
						description: 'People who helped to make the bot.',
						emoji: '📰'
					},
				])
		]);

		await interaction.editReply({
			components: [row]
		});

		const embed = new EmbedBuilder()
			.setTitle('SamBot\'s Info')
			.setColor('Blurple')
			.addFields([
				{
					name: "Command Count",
					value: `There are ${a} commands right now.`
				},
				{
					name: "An amazing fact!",
					value: "SamBot used to have a Geometry Dash cat icon as its profile picture!"
				},
				{
					name: "Bot's member count!",
					value: `SamBot currently has ${memberCount} cached members!`
				}
			]);

		const embed2 = new EmbedBuilder()
			.setTitle('Credits')
			.setColor('Blurple')
			.addFields([
				{
					name: 'Samaaa#1856',
					value: 'Developer',
					inline: false
				},
				{
					name: 'InkyKimmy',
					value: 'Random Ideas',
					inline: true
				}
			]);


		const collector = interaction.channel!.createMessageComponentCollector({
			componentType: ComponentType.SelectMenu,
			time: 60000
		});

		collector.on('collect', async (i: SelectMenuInteraction) => {
			if (i.customId === 'info-menu') {
				if (interaction.user.id === i.user.id) {
					const [category] = i.values;
					if (category === 'bot info') {
						i.update({ embeds: [embed], content: 'You\'ve selected the `Bot Info` menu.' });
					} else if (category === 'credits') {
						i.update({ embeds: [embed2], content: 'You\'ve selected the `Credits` menu.' });
					}
				} else {
					i.reply({ content: 'This select menu isn\'t for you.', ephemeral: true });
				};
			}
		});

		collector.on('end', async () => {
			row.components[0].setDisabled(true)
			row.components[1].setDisabled(true)
			await interaction.editReply({ components: [row], content: 'This menu has expired.' });
		});
	} else if (interaction.options.getSubcommand() === 'links') {
		const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents([
				new ButtonBuilder()
					.setLabel('Invite')
					.setStyle(ButtonStyle.Link)
					.setURL('https://discord.com/api/oauth2/authorize?client_id=923540727181500446&permissions=8&scope=bot%20applications.commands'),
				new ButtonBuilder()
					.setLabel('Support Server')
					.setStyle(ButtonStyle.Link)
					.setURL('https://discord.gg/wJMEqjGj2Q')
			]);

		await interaction.editReply({ content: 'Links for [SamBot](https://discord.com/api/oauth2/authorize?client_id=923540727181500446&permissions=8&scope=bot%20applications.commands "SamBot")!', components: [row] });
	}
}