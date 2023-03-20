import { config } from "dotenv";
import { readdirSync } from 'fs';
import {
	Client,
	IntentsBitField,
	Collection,
	PresenceUpdateStatus,
	Partials
} from "discord.js";
config();

const client: Client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.GuildEmojisAndStickers,
		IntentsBitField.Flags.GuildVoiceStates
	],
	partials: [
		Partials.Channel
	],
	presence: {
		status: PresenceUpdateStatus.DoNotDisturb
	}
});

client.spinners = [];

const commandFiles = readdirSync("./commands")
	.filter(file => file.endsWith(".ts"));

const commands: Array<any> = [];
client.commands = new Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}

const eventFiles = readdirSync("./events")
	.filter(file => file.endsWith(".ts"));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, commands));
	} else {
		client.on(event.name, (...args) => event.execute(...args, commands));
	}
};

client.on('shardError', error => {
	console.error('A websocket connection encountered an error:', error);
});

client.on('warn', console.log)
	.on('error', console.log)
	.on('shardError', console.log);

process.on('unhandledRejection', console.log)
	.on('uncaughtException', console.log);

client.login(process.env.TOKEN as string);