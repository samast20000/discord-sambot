import {
    SlashCommandBuilder,
    ComponentType,
    ModalBuilder,
    ButtonBuilder,
    TextInputBuilder,
    ActionRowBuilder,
    ButtonStyle,
    TextInputStyle,
    ButtonInteraction,
    ChatInputCommandInteraction
} from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('askquestion')
    .setDescription('Ask a question in the SamBot Support server!');

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    if (interaction.guild!.id !== '922885336026202152') return await interaction.editReply("**You can only use this command in the** [SamBot Support](https://discord.gg/Tdatr4WTdV) **server!**");
    const modal = new ModalBuilder()
        .setCustomId('question-modal')
        .setTitle('Question')
        .addComponents([
            new ActionRowBuilder<TextInputBuilder>().addComponents([
                new TextInputBuilder()
                    .setCustomId('question-input')
                    .setLabel('Put your question here!')
                    .setStyle(TextInputStyle.Paragraph)
                    .setMinLength(8)
                    .setMaxLength(140)
                    .setPlaceholder('Your question')
                    .setRequired(true)
            ])
        ]);
    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
            new ButtonBuilder()
                .setLabel('Yes')
                .setCustomId('yes-button')
                .setEmoji({ animated: false, id: "984497626454061076", name: "allow" })
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setLabel('No')
                .setCustomId('no-button')
                .setEmoji({ animated: false, id: "984497629201334302", name: "deny" })
                .setStyle(ButtonStyle.Danger)
        ]);

    await interaction.editReply({
        content: 'Are you sure you want to ask this question?',
        components: [row]
    });

    const collector = interaction.channel!.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 60000,
    });

    collector.on('collect', async (i: ButtonInteraction) => {
        if (i.customId === 'yes-button') {
            if (i.user.id === interaction.user.id) {
                row.components[0].setDisabled(true)
                await i.showModal(modal);
                await i.editReply({components: [row]})
            } else {
                i.reply({ content: 'This isn\'t your button.', ephemeral: true });
            }
        } else if (i.customId === 'no-button') {
            if (i.user.id === interaction.user.id) {
                row.components[1].setDisabled(true)
                await i.update({ components: [row] });
            } else {
                i.reply({ content: 'This isn\'t your button.', ephemeral: true });
            }
        }
    });

    collector.on('end', async () => {
        row.components[1].setDisabled(true)
        row.components[0].setDisabled(true)
        await interaction.editReply({ components: [row] });
    });
}