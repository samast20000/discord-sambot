import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { joinVoiceChannel, createAudioPlayer, createAudioResource } from "@discordjs/voice";
import { join } from "path";

export const data = new SlashCommandBuilder()
    .setName('sfx')
    .setDescription('Play a collection of memey sound effects. 🤣')
    .addStringOption((option) => {
        return option
            .setName('sound')
            .setDescription('The sound to play.')
            .setRequired(true)
            .addChoices(
                { name: "Tiktok Snore", value: "audio/snore.ogg" },
                { name: "Vine Boom", value: "audio/boom.mp3" },
                { name: "Nokia Ringtone", value: "audio/nokia.mp3" }
            )
    });

export async function execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) return;
    await interaction.deferReply()
    
    let choiceProperties: {name: string, time: number} = {name: "none", time: 0}

    switch(interaction.options.getString('sound')) {
        case 'audio/snore.ogg':
            choiceProperties.name = "Tiktok Snore";
            choiceProperties.time = 8500;
            break;

        case 'audio/boom.mp3':
            choiceProperties.name = "Vine Boom";
            choiceProperties.time = 2500;
            break;

        case 'audio/nokia.mp3':
            choiceProperties.name = "Nokia Ringtone";
            choiceProperties.time = 9500;
            break;
    }

    if (interaction.member.voice.channelId) { // checks if user is in the channel
        await interaction.editReply(`<:allow:984497626454061076> **Playing sound \`${choiceProperties.name}\`...**`)
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });

        const player = createAudioPlayer();

        const resource = createAudioResource(join(__dirname, interaction.options.getString("sound")!));
        connection.subscribe(player);
        player.play(resource);
        setTimeout(() => {
            player.stop()
            connection.destroy()
        }, choiceProperties.time);
    } else {
        return await interaction.editReply("<:deny:984497629201334302> **You must be in a voice channel to use this command!**")
    }
}