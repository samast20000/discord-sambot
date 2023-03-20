import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('slap')
    .setDescription('Slap someone!')
    .setDMPermission(false)
    .addUserOption((option) => option
        .setName('target')
        .setDescription('Person to slap!')
        .setRequired(true)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const target: any = interaction.options.getUser('target');
    if (target.id === interaction.client.user!.id) {
        return interaction.reply({ content: 'You can\'t slap me, idiot.', ephemeral: true });
    };

    if (target.bot) {
        return interaction.reply({ content: 'You can\'t slap a bot, back off my kind idiot.', ephemeral: true })
    };

    if (target.id === interaction.user.id) {
        return interaction.reply({ content: 'Why would you slap yourself, dumb idiot?' })
    }
    
    const randomPhrases = [
        " right in the face",
        " really hard",
        ", making them tremble like a fish",
        " as hard as a rock"
    ];

    const rand = randomPhrases[Math.floor(Math.random() * randomPhrases.length)];
    await interaction.reply({
        content: `Slapped <@${target.id}>${rand}.`,
        allowedMentions: { users: [] }
    });
}