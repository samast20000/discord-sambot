import { ActivityType, Client, Routes, REST as Rest, Events } from "discord.js";

export const name = Events.ClientReady;
export const once = true;
export async function execute(client: Client<true>, commands: any[]) {
	console.log(`[READY] Logged in as ${client.user.tag}!`);

	const members = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

	client.user.setActivity({
		name: `with ${members} people`,
		type: ActivityType.Playing
	})

	const clientId = client.user.id;

	const rest = new Rest({
		version: "10",
	}).setToken(process.env.TOKEN as string);

	(async () => {
		try {
			await rest.put(Routes.applicationCommands(clientId), {
				body: commands,
			});
			console.log("(/) Successfully registered commands globally");
		} catch (err) {
			if (err) {
				console.error(err);
			};
		};
	})();
}