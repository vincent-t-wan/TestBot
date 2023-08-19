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

	if (commandName === 'upload') {
		await interaction.reply('uploading...');
	} else if (commandName === 'display') {
        type = interaction.options.getString('type')
        switch(type) {
            case 'grades':
                await interaction.reply('displaying grades...');

                break;
            case 'classes':
                await interaction.reply('displaying classes...');
                break;
            default:
          }
	}

});

console.log(client)
client.login(process.env.DISCORD_TOKEN);