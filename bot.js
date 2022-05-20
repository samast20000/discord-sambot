require('dotenv').config()
const { readdirSync } = require('fs');
const { Client, GatewayIntentBits, Collection, Partials, ActivityType } = require("discord.js");
const { PresenceUpdateStatus } = require('discord-api-types/v10');

if (process.env.DATABASE !== 'false') {
	const database = require('./config/database')
	const db = new database();
	db.connect();
}

const activities = [
	{ type: ActivityType.Listening, name: 'commands | /ping' },
	{ type: ActivityType.Watching, name: 'memes | /ping' },
	{ type: ActivityType.Playing, name: 'Minecraft | /ping' }
];
const randomActivity = activities[Math.floor(Math.random() * activities.length)]

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMembers
	],
	partials: [
		Partials.Message,
		Partials.Channel,
		Partials.Reaction,
	],
	presence: {
		activities: [{
			name: randomActivity.name,
			type: randomActivity.type
		}],
		status: PresenceUpdateStatus.DoNotDisturb
	}
});

const commandFiles = readdirSync("./commands")
	.filter(file => file.endsWith(".js"));

const commands = [];
client.commands = new Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}

const eventFiles = readdirSync("./events")
	.filter(file => file.endsWith(".js"))

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
	.on('shardError', console.log)


process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.login(process.env.TOKEN);