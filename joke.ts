import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { fetch } from 'undici';

export const data = new SlashCommandBuilder()
    .setName('joke')
    .setDescription('What\'s the time? Oh, it\'s joke time. 🤣');

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    await interaction.editReply('Finding a joke...');
    const data = await fetch('https://joke.deno.dev/')
    const res: any = await data.json();
    if (res) {
        interaction.editReply({ content: `${res.setup} ||**${res.punchline}**||` });
    } else {
        interaction.editReply({ content: 'Joke not found, please run again.' });
        console.log('joke command error');
    }
}