import {
	EmbedBuilder,
	ChannelType,
	SlashCommandBuilder,
	Channel,
	ChatInputCommandInteraction
} from "discord.js";

export const data = new SlashCommandBuilder()
	.setName('serverinfo')
	.setDMPermission(false)
	.setDescription('Tells you the info of the server you\'re in!');

export async function execute(interaction: ChatInputCommandInteraction) {
	if (!interaction.inCachedGuild()) return;
	await interaction.deferReply();
	const { guild } = interaction;
	const infoEmbed = new EmbedBuilder()
		.setAuthor({ name: guild.name, iconURL: (guild.iconURL() as string | undefined) })
		.setThumbnail(guild.iconURL())
		.setColor('Blurple')
		.addFields([
			{
				name: 'General',
				value: [
					`Created: <t:${parseInt(guild.createdTimestamp / 1000 as unknown as string)}:R>`,
					`Owner: <@${guild.ownerId}>`,
					`Server ID: \`${guild.id}\``,
					`\nDescription: **${guild.description || 'None'}**`
				].join('\n')
			},
			{
				name: 'Users',
				value: [
					`- Members: ${guild.members.cache.filter((m) => !m.user.bot).size}`,
					`- Bots: ${guild.members.cache.filter((m) => m.user.bot).size}`,
					`Total: ${guild.memberCount}`
				].join('\n')
			},
			{
				name: 'Channels',
				value: [
					`- Text: ${guild.channels.cache.filter((c: Channel) => c.type === ChannelType.GuildText).size}`,
					`- Voice: ${guild.channels.cache.filter((c: Channel) => c.type === ChannelType.GuildVoice).size}`,
					`- Categories: ${guild.channels.cache.filter((c: Channel) => c.type === ChannelType.GuildCategory).size}`,
					`- Stages: ${guild.channels.cache.filter((c: Channel) => c.type === ChannelType.GuildStageVoice).size}`,
					`- Forums: ${guild.channels.cache.filter((c: Channel) => c.type === ChannelType.GuildForum).size}`,
					`- Private Threads: ${guild.channels.cache.filter((c: Channel) => c.type === ChannelType.PrivateThread).size}`,
					`- Public Threads: ${guild.channels.cache.filter((c: Channel) => c.type === ChannelType.PublicThread).size}`,
					`Total: ${guild.channels.cache.size}`
				].join('\n')
			},
			{
				name: 'Emojis and Stickers',
				value: [
					`- Animated: ${guild.emojis.cache.filter((e: any) => e.animated).size}`,
					`- Static: ${guild.emojis.cache.filter((e: any) => !e.animated).size}`,
					`Total: ${guild.emojis.cache.size}`
				].join('\n')
			}
		]);

	await interaction.editReply({ embeds: [infoEmbed] });
}