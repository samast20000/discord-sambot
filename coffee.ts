import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, Colors } from "discord.js";
import { fetch } from 'undici';

export const data = new SlashCommandBuilder()
    .setName('coffee')
    .setDescription('Have a nice cup of coffee! ☕');

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    await interaction.editReply('Looking for a coffee... :coffee:');
    const data = await fetch('https://coffee.alexflipnote.dev/random.json')
    const res: any = await data.json();
    const embed = new EmbedBuilder()
        .setTitle('Coffee! :coffee:')
        .setColor(Colors.Blurple)
        .setImage(res.file)
        .setURL(res.file);

    interaction.editReply({ content: 'Found one!', embeds: [embed] });
}