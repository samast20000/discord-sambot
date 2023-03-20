import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, Colors } from "discord.js";
export const data = new SlashCommandBuilder()
    .setName('choose')
    .setDescription('SamBot will choose for you.')
    .addStringOption((option) => option
        .setName('1st')
        .setDescription('First option to choose from.')
        .setRequired(true)
    )
    .addStringOption((option) => option
        .setName('2nd')
        .setDescription('Second option to choose from.')
        .setRequired(true)
    );
    
export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const randomword = Math.floor(Math.random() * 2);
    let pick: string | undefined | null;
    if (randomword === 0) {
        pick = interaction.options.getString('1st');
    } else {
        if (randomword === 1) {
            pick = interaction.options.getString('2nd');
        }
    }
    const embed3 = new EmbedBuilder()
        .setTitle('SamBot\'s Choice')
        .setColor(Colors.Blurple)
        .addFields([
            { name: "Options", value: '**' + interaction.options.getString('1st') + '** and **' + interaction.options.getString('2nd') + '**' },
            { name: "Chosen", value: '**' + pick + '** was chosen by SamBot.' },
        ])
        .setFooter({ text: 'I have chosen', iconURL: 'https://media.discordapp.net/attachments/907587945198923806/938794904111423528/930422780124606474.gif' });
    await interaction.editReply({ embeds: [embed3] });
}