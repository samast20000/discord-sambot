import { EmbedBuilder, Guild, GuildMember, SlashCommandBuilder, User, UserFlagsBitField, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName('userinfo')
	.setDescription('Tells you someone\'s (or your) user info.')
	.setDMPermission(false)
	.addUserOption((option) => option
		.setName('target')
		.setDescription('The user you would like to see the info of.')
		.setRequired(false)
	);

export async function execute(interaction: ChatInputCommandInteraction) {
	if (!interaction.inCachedGuild()) return;
	try {
		const user: User = interaction.options.getUser('target') || interaction.user;
		const member: GuildMember = interaction.options.getMember('target')! || interaction.member!;
		const userFlags: Array<string> = (user.flags as UserFlagsBitField).toArray();
		const embed3 = new EmbedBuilder()
			.setTitle(`${user.username}'s Info`)
			.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
			.setColor('Blurple')
			.setThumbnail(user.displayAvatarURL())
			.addFields([
				{
					name: 'ID',
					value: user.id
				},
				{
					name: 'Nickname',
					value: member.displayName
				},
				{
					name: `${(interaction.guild as Guild).name} Member Since`,
					value: `<t:${parseInt((member.joinedTimestamp as number) / 1000 as unknown as string)}:R>`,
				},
				{
					name: 'Discord User Since',
					value: `<t:${parseInt(user.createdTimestamp / 1000 as unknown as string)}:R>`,
				},
				{
					name: 'User Flags',
					value: userFlags.join('\n') || 'None'
				}
			])
			.setFooter({ text: user.bot ? "This user is a bot." : "This user is not a bot.", iconURL: 'https://emoji.gg/assets/emoji/1646-discord-bot-en.png' });

		await interaction.reply({ embeds: [embed3] });
	} catch (error) {
		await interaction.reply({ content: '`' + error + '`\nPlease run the command again.', ephemeral: true });
	}
}