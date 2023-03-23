import { Collection } from 'discord.js';

// extends the client with more properties, epic.

interface ClientData {
    commands: Collection<unknown, any>
    spinners: Array<string>
}

interface EmbedData {
    stuff: Collection<unknown, any>
}

declare module 'discord.js' {
   export interface Client extends ClientData {}
   export interface EmbedBuilder extends EmbedData {}
}