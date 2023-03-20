import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { fetch } from 'undici';


export const data = new SlashCommandBuilder()
    .setName('kitty')
    .setDescription('Get a close look at a random kitty 🐱');

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    await interaction.editReply('Looking for a kitty :cat:');
    let array = [
        ":cat: Meowwww...",
        ":cat: Meow!",
        ":cat: Meow...",
        ":cat: Meeowwww..",
        ":cat: Purr...",
        ":cat: Mew!",
        ":cat: Miaow!"
    ];
    const rand = array[Math.floor(Math.random() * array.length)];
    const data = await fetch('https://api.thecatapi.com/v1/images/search')
    const res: any = await data.json()
    if (res[0].url) {
        const embed2 = new EmbedBuilder();
        embed2.setTitle(rand)
            .setURL(res[0].url)
            .setColor('Blurple')
            .setImage(res[0].url);

        interaction.editReply({ content: 'Found one!', embeds: [embed2] });
    } else {
        interaction.editReply({
            content: 'Cat not found, please run the command again.',
        });
        console.log('kitty command error');
    }
}