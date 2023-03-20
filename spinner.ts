import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { setTimeout } from "timers/promises";

export const data = new SlashCommandBuilder()
    .setName('fidgetspinner')
    .setDescription('Spins a fidget spinner! See how long it goes and flex on your friends!')
    .setDMPermission(false);

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    for (let i of interaction.client.spinners) {
        if (i === interaction.user.id) {
            return interaction.editReply({content: '<:redspinner:995709426575097957> You already have a spinner spinning!'});
        }
    }

    const randNum = Math.floor(Math.random() * 1800000);
    await interaction.editReply({ content: '<:redspinner:995709426575097957> You spun your fidget spinner! Let\'s see how long it spins...'});
    
    interaction.client.spinners.push(interaction.user.id);
    setTimeout(randNum).then(async () => {
        for (let i = 0; i < interaction.client.spinners.length; i++) {
            if (interaction.client.spinners[i] === interaction.user.id) {
                interaction.client.spinners.splice(i, 1)
            }
        }

        await interaction.channel?.send({
            content: `<:redspinner:995709426575097957> <@${interaction.user.id}>, your fidget spinner spun for **${Math.round(randNum / 1000)}** seconds!`
        })
    }).catch(async (err: any) => {
        console.error(err)
        await interaction.editReply({ content: `Error: ${err}` })
    })
}