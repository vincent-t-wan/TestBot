require('dotenv').config();
const Discord = require("discord.js");
const client = new Discord.Client({intents: ["Guilds", "GuildMessages", "MessageContent"]});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

// on message sent by user
client.on("messageCreate", msg => {
    console.log(msg)
  if (msg.content === "ping") {
    msg.reply("pong");
  }
})

// on slash command sent by user
client.on("interactionCreate", async interaction => {
    console.log(interaction)
    if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'server') {
		await interaction.reply('Server info.');
	} else if (commandName === 'user') {
		await interaction.reply('User info.');
	}

});

console.log(client)
client.login(process.env.DISCORD_TOKEN);