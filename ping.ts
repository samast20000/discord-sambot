import {
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType,
    SlashCommandBuilder,
    ButtonInteraction,
    EmbedBuilder,
    ChatInputCommandInteraction
} from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong! 🏓');

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
        new ButtonBuilder()
            .setLabel('Record Ping')
            .setCustomId('ping-button')
            .setEmoji("🏓")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(false),
        new ButtonBuilder()
            .setLabel('End Interaction')
            .setCustomId('ping-end-button')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(false)
    ]);
    
    const embed = new EmbedBuilder()
        .setTitle('Statistics')
        .setColor('Blurple')
        .addFields([
            {
                name: 'Ping',
                value: `${interaction.client.ws.ping} ms.`
            },
            {
                name: 'Uptime',
                value: `<t:${parseInt(interaction.client.readyTimestamp as number / 1000 as unknown as string)}:R>`
            }
        ]);

    await interaction.editReply({ components: [row], content: 'Pong! :ping_pong:', embeds: [embed] });
    const collector = interaction.channel?.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 300000,
    });

    collector?.on('collect', async (i: ButtonInteraction) => {
        if (i.customId === 'ping-button') {
            if (interaction.user.id === i.user.id) {
                EmbedBuilder.from(embed).setFields([
                    {
                        name: 'Ping',
                        value: `${interaction.client.ws.ping} ms.`
                    },
                    {
                        name: 'Uptime',
                        value: `<t:${parseInt(interaction.client.readyTimestamp as number / 1000 as unknown as string)}:R>`
                    }
                ]);

                await i.update({
                    content: 'Pong! :ping_pong:',
                    embeds: [embed]
                });
            } else {
                await i.reply({ content: 'This button isn\'t for you.', ephemeral: true });
            };
        } else if (i.customId === 'ping-end-button') {
            if (interaction.user.id === i.user.id) {
                row.components[1].setDisabled(true)
                row.components[0].setDisabled(true)
                await i.update({
                    content: 'Pong! :ping_pong:',
                    embeds: [embed],
                    components: [row]
                });
                collector.stop();
            } else {
                await i.reply({ content: 'This button isn\'t for you.', ephemeral: true });
            };
        }
    });

    collector?.on('end', async () => {
        row.components[1].setDisabled(true)
        row.components[0].setDisabled(true)
        await interaction.editReply({ components: [row] });
    });
}