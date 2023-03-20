import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { fetch } from 'undici';

export const data = new SlashCommandBuilder()
    .setName('puppy')
    .setDescription('Get a close look at a random puppy 🐶');
export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    await interaction.editReply('Looking for a puppy :dog:');
    let array = [
        ":dog: Woof...",
        ":dog: Woof!",
        ":dog: Woofff...",
        ":dog: Wooofff..",
        ":dog: Woof?",
    ];
    const rand = array[Math.floor(Math.random() * array.length)];
    const data = await fetch('https://dog.ceo/api/breeds/image/random')
    const res: any = await data.json();
    if (res.message) {
        const embed2 = new EmbedBuilder()
            .setTitle(rand)
            .setURL(res.message)
            .setColor("Blurple")
            .setImage(res.message);

        interaction.editReply({ content: 'Found one!', embeds: [embed2] });
    } else {
        interaction.editReply({ content: 'Dog not found, please run the command again.' });
        console.log('puppy command error');
    }
}